from z3 import *
import ast
import copy

ast_z3_map = {
    ast.Add: lambda a, b: a + b,
    ast.Sub: lambda a, b: a - b,
    ast.Mult: lambda a, b: a * b,
    ast.Div: lambda a, b: a / b,
    ast.Mod: lambda a, b: a % b,
    ast.Pow: lambda a, b: a ** b,
    ast.FloorDiv: lambda a, b: a / b,

    ast.BitAnd: lambda a, b: a & b,
    ast.BitOr: lambda a, b: a | b,
    ast.BitXor: lambda a, b: a ^ b,
    ast.LShift: lambda a, b: a << b,
    ast.RShift: lambda a, b: a >> b,
    
    ast.Eq: lambda a, b: a == b,
    ast.NotEq: lambda a, b: a != b,
    ast.Gt: lambda a, b: a > b,
    ast.GtE: lambda a, b: a >= b,
    ast.Lt: lambda a, b: a < b,
    ast.LtE: lambda a, b: a <= b,
    
    ast.And: lambda a, b: And(a, b),
    ast.Or: lambda a, b: Or(a, b),
}


def ast_to_z3(node, variables):
    if isinstance(node, ast.Tuple):
        return tuple(ast_to_z3(elt, variables) for elt in node.elts)

    elif isinstance(node, ast.BinOp):
        left = ast_to_z3(node.left, variables)
        right = ast_to_z3(node.right, variables)
        return ast_z3_map[type(node.op)](left, right)
    
    elif isinstance(node, ast.Subscript):
        arr = ast_to_z3(node.value, variables)
        index = ast_to_z3(node.slice, variables)
        return Select(arr, index)  # Z3's way to access array elements


    elif isinstance(node, ast.Compare):
        left = ast_to_z3(node.left, variables)
        right = ast_to_z3(node.comparators[0], variables)
        return ast_z3_map[type(node.ops[0])](left, right)

    elif isinstance(node, ast.Name):
        return variables[node.id]

    elif isinstance(node, ast.Constant):
        val = node.value
        if isinstance(val, int):
            return IntVal(val)
        elif isinstance(val, float):
            return RealVal(val)
        elif isinstance(val, bool):
            return BoolVal(val)
        elif isinstance(val, str):
            return StringVal(val)
        else:
            raise NotImplementedError(f"Unsupported constant type: {type(val)}")

    elif isinstance(node, ast.BoolOp):
        left = ast_to_z3(node.values[0], variables)
        right = ast_to_z3(node.values[1], variables)
        return ast_z3_map[type(node.op)](left, right)
    
    elif isinstance(node, ast.UnaryOp):
        operand = ast_to_z3(node.operand, variables)
        if isinstance(node.op, ast.USub):      # e.g., -1
            return -operand
        elif isinstance(node.op, ast.UAdd):    # e.g., +1 (rare)
            return operand
        elif isinstance(node.op, ast.Not):     # e.g., not x
            return Not(operand)
        else:
            raise NotImplementedError(f"Unsupported unary operator: {type(node.op)}")

    elif isinstance(node, ast.Call):
        # Specifically handle len(x)
        if isinstance(node.func, ast.Name) and node.func.id == 'len':
            arg = node.args[0]
            var_name = f"{arg.id}_len"
            print(f"arg: {arg}, var: {var_name}")
            if var_name in variables:
                return variables[var_name]
            else:
                raise ValueError(f"Missing symbolic length for variable: {var_name}")
        else:
            raise NotImplementedError(f"Unsupported function call: {ast.dump(node)}")

    else:
        raise NotImplementedError(f"Unsupported AST node: {ast.dump(node)}")

def symbolic_execute(statements, memory, path_condition, all_paths):
    for stmt in statements:
        if isinstance(stmt, ast.Assign):
            target = stmt.targets[0]

            if isinstance(target, ast.Name):
                var = target.id
                value = ast_to_z3(stmt.value, memory)
                memory[var] = value

            elif isinstance(target, ast.Tuple):
                # Unpack values from RHS tuple
                values = ast_to_z3(stmt.value, memory)
                if not isinstance(values, tuple) or len(values) != len(target.elts):
                    raise ValueError("Tuple unpacking mismatch")

                for elt, val in zip(target.elts, values):
                    if isinstance(elt, ast.Name):
                        memory[elt.id] = val

        elif isinstance(stmt, ast.If):
            cond = ast_to_z3(stmt.test, memory)

            # Then branch
            then_mem = copy.deepcopy(memory)
            then_pc = And(path_condition, cond)
            symbolic_execute(stmt.body, then_mem, then_pc, all_paths)

            # Else branch
            else_mem = copy.deepcopy(memory)
            else_pc = And(path_condition, Not(cond))
            symbolic_execute(stmt.orelse, else_mem, else_pc, all_paths)

        elif isinstance(stmt, ast.Return):
            return_expr = ast_to_z3(stmt.value, memory)
            all_paths.append({
                "pc": path_condition,
                "ret": return_expr,
                "from": ast.dump(stmt),
                "context": list(memory.items())
            })


        elif isinstance(stmt, ast.While):
            cond = ast_to_z3(stmt.test, memory)

            # Limit how deep we unroll
            max_unroll = 3

            def unroll_loop(mem, pc, depth):
                if depth > max_unroll:
                    return
                cond_eval = ast_to_z3(stmt.test, mem)
                
                # Loop body taken
                loop_body_mem = copy.deepcopy(mem)
                loop_body_pc = And(pc, cond_eval)
                symbolic_execute(stmt.body, loop_body_mem, loop_body_pc, all_paths)
                unroll_loop(loop_body_mem, loop_body_pc, depth + 1)

                # Exit condition
                after_loop_mem = copy.deepcopy(mem)
                after_loop_pc = And(pc, Not(cond_eval))
                symbolic_execute(stmt.orelse or [], after_loop_mem, after_loop_pc, all_paths)

            unroll_loop(memory, path_condition, 1)

        elif isinstance(stmt, ast.For):
            if not (isinstance(stmt.iter, ast.Call) and 
                    isinstance(stmt.iter.func, ast.Name) and 
                    stmt.iter.func.id == 'range'):
                raise NotImplementedError("Only simple `range()` loops are supported")

            range_args = stmt.iter.args
            if len(range_args) == 1:
                start, end = 0, ast_to_z3(range_args[0], memory)
            elif len(range_args) == 2:
                start, end = ast_to_z3(range_args[0], memory), ast_to_z3(range_args[1], memory)
            else:
                raise NotImplementedError("range(start, stop, step) not yet supported")

            max_unroll = 5  # Prevent infinite expansion
            for_val = stmt.target.id

            for i in range(max_unroll):
                if isinstance(start, IntNumRef):
                    iter_i = IntVal(start.as_long() + i)
                else:
                    start = IntVal(start) if isinstance(start, int) else start
                    iter_i = simplify(start + i)

                iter_cond = simplify(iter_i < end)
                if isinstance(iter_cond, bool) and not iter_cond:
                    break   
                loop_mem = copy.deepcopy(memory)
                loop_mem[for_val] = iter_i
                symbolic_execute(stmt.body, loop_mem, iter_cond, all_paths)

            # After loop finishes
            after_mem = copy.deepcopy(memory)
            symbolic_execute(stmt.orelse or [], after_mem, path_condition, all_paths)


def extract_paths_from_code(code_str):
    tree = ast.parse(code_str)
    func = tree.body[0]
    
    memory = {
        'a': Int('a'),
        'b': Int('b'),
        'i': Int('i')
    }
    path_condition = BoolVal(True)
    all_paths = []

    symbolic_execute(func.body, memory, path_condition, all_paths)
    return all_paths

paths1 = extract_paths_from_code(target_py_function)
arr1 = list() # containing all pcs and returns from target function
print("target code paths")
for path in paths1:
    pc = path["pc"]
    ret = path["ret"]
    # Optionally:
    origin = path.get("from")
    context = path.get("context")
    arr1.append((pc, ret))
    # print("IF:", pc)
    # print("RETURNS:", ret)

arr2 = list() # containing all pcs and returns from test function
paths2 = extract_paths_from_code(test_py_function)
print("user code paths: ")
for path in paths2:
    pc = path["pc"]
    ret = path["ret"]
    # Optionally:
    origin = path.get("from")
    context = path.get("context")
    arr2.append((pc, ret))
    # print("IF: ", pc)
    # print("RETURNS: ", ret)
    
solver = z3.Solver()
print("Comparing test function paths to golden paths...")
any_bug = False

for t_pc, t_ret in arr1:
    solver.push()
    # Try to find any input satisfying t_pc where ALL user paths give wrong return
    disjunctions = []
    for u_pc, u_ret in arr2:
        # For each user path: if the path condition holds under t_pc,
        # check if the return is not equal to expected
        disjunctions.append(And(u_pc, u_ret != t_ret))
    
    # Now say: t_pc ∧ (∀ user paths, u_ret != t_ret)
    solver.add(t_pc, Or(*disjunctions))
    
    if solver.check() == z3.sat:
        print(f"Bug: For inputs satisfying condition: {t_pc}")
        print(f"    Expected return: {t_ret}")
        print(f"    But all user paths give wrong result.")
        print("    Example input:", solver.model())
        any_bug = True
    solver.pop()


if not any_bug:
    print("All target (golden) paths are correctly handled in user code.")

