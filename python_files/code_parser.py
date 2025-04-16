import ast
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

class Code(BaseModel):
    student_code: str
    optimal_code: str

app = FastAPI()

origins = [
    "http://localhost:5173",  # your frontend dev URL
    # Add other URLs if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],              # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],              # Allow all headers
)

class CodeAnalyzer(ast.NodeVisitor):
    def __init__(self):
        self.returns = {}
        self.ifs = {}
        self.fors = {}
        self.whiles = {}
        self.assignments = {}
        self.calls = {}
        self.func_signatures = {}
        self._func_stack = []
        self.statements = []

    def build(self, node):
        return self.visit(node)
    
    def generic_visit(self, node):
        return {"type": type(node).__name__, "children": []}

    def visit_Module(self, node):
            return {"type": "module", "children": [self.visit(stmt) for stmt in node.body]}

    def visit_If(self, node):
        blocks = []

        # Add the initial if
        blocks.append({
            "type": "if",
            "condition": ast.unparse(node.test),
            "children": [self.visit(stmt) for stmt in node.body]
        })

        # Walk through orelse to handle elif / else
        current = node
        while current.orelse:
            if isinstance(current.orelse[0], ast.If):
                current = current.orelse[0]
                blocks.append({
                    "type": "elif",
                    "condition": ast.unparse(current.test),
                    "children": [self.visit(stmt) for stmt in current.body]
                })
            else:
                # Final else
                blocks.append({
                    "type": "else",
                    "children": [self.visit(stmt) for stmt in current.orelse]
                })
                break

        return blocks[0]  # You can choose to return a list or inject this logic into a parent node


    def visit_While(self, node):
        return {
            "type": "while",
            "condition": ast.unparse(node.test),
            "children": [self.visit(stmt) for stmt in node.body],
        }

    def visit_For(self, node):
        return {
            "type": "for",
            "target": ast.unparse(node.target),
            "iter": ast.unparse(node.iter),
            "children": [self.visit(stmt) for stmt in node.body],
        }

    def visit_Assign(self, node):
        return {
            "type": "assign",
            "target": ast.unparse(node.targets[0]),
            "value": ast.unparse(node.value),
        }
    
    def visit_Call(self, node):
        return {
            "type": "call",
            "func": ast.unparse(node.func),
            "args": [ast.unparse(arg) for arg in node.args],
        }

    def visit_Expr(self, node):
        return {
            "type": "expr",
            "value": self.visit(node.value)
        }

    def visit_FunctionDef(self, node):
        return {
            "type": "function_def",
            "name": node.name,
            "args": [arg.arg for arg in node.args.args],
            "children": [self.visit(stmt) for stmt in node.body],
        }

    def visit_Return(self, node):
        return {
            "type": "return",
            "value": ast.unparse(node.value) if node.value else None,
        }

def analyze_code(code):
    tree = ast.parse(code)
    builder = CodeAnalyzer()
    return builder.build(tree)

def print_tree(tree, level=0):
    for stmt in tree.get("children", []):
        print_statement(stmt, level)

def print_statement(stmt, level):
    if level == 0:
        indent = ""
    else:
        indent = "│   " * (level - 1) + "├── "

    # Handle flattened if/elif/else blocks
    if isinstance(stmt, list):
        for sub_stmt in stmt:
            print_statement(sub_stmt, level)
        return

    stmt_type = stmt.get("type")

    if stmt_type == "if" or stmt_type == "elif":
        keyword = "If" if stmt_type == "if" else "Elif"
        condition = stmt.get("condition", "<unknown>")
        print(f"{indent}{keyword} (condition: {condition})")
        for child in stmt.get("children", []):
            print_statement(child, level + 1)

    elif stmt_type == "else":
        print(f"{indent}Else:")
        for child in stmt.get("children", []):
            print_statement(child, level + 1)

    elif stmt_type == "function_def":
        name = stmt.get("name", "<unknown>")
        args = stmt.get("args", "unknown>")
        print(f"{indent}Function Def: {name}({args})")
        for child in stmt.get("children"):
            print_statement(child, level + 1)

    elif stmt_type == "for":
        target = stmt.get("target", "<var>")
        iter_ = stmt.get("iter", "<iterable>")
        print(f"{indent}For (target: {target}, iter: {iter_})")
        for child in stmt.get("children", []):
            print_statement(child, level + 1)

    elif stmt_type == "while":
        condition = stmt.get("condition", "<unknown>")
        print(f"{indent}While (condition: {condition})")
        for child in stmt.get("children", []):
            print_statement(child, level + 1)

    elif stmt_type == "return":
        value = stmt.get("value", "<value>")
        print(f"{indent}Return: {value}")

    elif stmt_type == "assign":
        target = stmt.get("target", "<target>")
        value = stmt.get("value", "<value>")
        print(f"{indent}Assign: {target} = {value}")

    elif stmt_type == "call":
        func = stmt.get("func", "<func>")
        args = stmt.get("args", [])
        print(f"{indent}Call: {func}({', '.join(args)})")

    elif stmt_type == "expr":
        print(f"{indent}Expr:")
        print_statement(stmt.get("value", {}), level + 1)

    else:
        print(f"{indent}{stmt_type.capitalize()}: {stmt}")

def compare_ast(opt_node, stu_node, path="root"):
    diffs = []

    def add_diff(diff_type, expected, found, local_path):
        diffs.append({
            "path": local_path,
            "type": diff_type,
            "expected": expected,
            "found": found
        })

    # print(f'opt node: {opt_node}')
    # print(f"stu node: {stu_node}")

    if opt_node["type"] != stu_node["type"]:
        add_diff("type_mismatch", opt_node["type"], stu_node["type"], path)
        return diffs

    node_type = opt_node["type"]

    if node_type == "function_def":
        if opt_node["name"] != stu_node["name"]:
            add_diff("function_name_mismatch", opt_node["name"], stu_node["name"], path + " > function_def")
        if opt_node.get("args") != stu_node.get("args"):
            add_diff("function_args_mismatch", opt_node.get("args"), stu_node.get("args"), path + " > args")

    elif node_type == "assign":
        if opt_node["target"] != stu_node["target"]:
            add_diff("assign_target_mismatch", opt_node["target"], stu_node["target"], path + " > assign")
        if opt_node["value"] != stu_node["value"]:
            add_diff("assign_value_mismatch", opt_node["value"], stu_node["value"], path + " > assign")

    elif node_type in ["if", "elif", "while"]:
        if opt_node.get("condition") != stu_node.get("condition"):
            add_diff("condition_mismatch", opt_node.get("condition"), stu_node.get("condition"), path + f" > {node_type}")

    elif node_type == "for":
        if opt_node.get("iter") != stu_node.get("iter"):
            add_diff("iter_range_mismatch", opt_node.get("iter"), stu_node.get("iter"), path + " > iter range")

    elif node_type == "return":
        if opt_node.get("value") != stu_node.get("value"):
            add_diff("return_value_mismatch", opt_node.get("value"), stu_node.get("value"), path + " > return")

    elif node_type == "expr":
        opt_val, stu_val = opt_node["value"], stu_node["value"]
        if opt_val["type"] == "call" and stu_val["type"] == "call":
            if opt_val["func"] != stu_val["func"]:
                add_diff("call_func_mismatch", opt_val["func"], stu_val["func"], path + " > call")
            if opt_val["args"] != stu_val["args"]:
                add_diff("call_args_mismatch", opt_val["args"], stu_val["args"], path + " > call")

    # Recurse into children
    opt_children = opt_node.get("children", [])
    stu_children = stu_node.get("children", [])

    # If either child is a list inside a list (like `[[{...}]]`), flatten it
    if len(opt_children) == 1 and isinstance(opt_children[0], list):
        opt_children = opt_children[0]
    if len(stu_children) == 1 and isinstance(stu_children[0], list):
        stu_children = stu_children[0]

    min_len = min(len(opt_children), len(stu_children))
    for i in range(min_len):
        # print(f"\nComparing path: {path + f' > {node_type}[{i}]'}")
        # print(f"opt_children[{i}]: {opt_children[i]}")
        # print(f"stu_children[{i}]: {stu_children[i]}")
        # print(f"opt_children[{i}] type: {type(opt_children[i])}")
        # print(f"stu_children[{i}] type: {type(stu_children[i])}")

        diffs += compare_ast(opt_children[i], stu_children[i], path + f" > {node_type}[{i}]")

    # Handle missing or extra children
    if len(opt_children) > len(stu_children):
        for i in range(len(stu_children), len(opt_children)):
            add_diff("missing_child", opt_children[i], None, path + f" > {node_type}[{i}]")
    elif len(stu_children) > len(opt_children):
        for i in range(len(opt_children), len(stu_children)):
            add_diff("extra_child", None, stu_children[i], path + f" > {node_type}[{i}]")

    return diffs

@app.post('/compare-code')
def compare_code(payload: Code):

    # print("🔍 Student Code:")
    # print(payload.student_code)
    # print("🔍 Optimal Code:")
    # print(payload.optimal_code)
    
    """ Compares structural elements between student and optimal solution """
    
    student_analysis = analyze_code(payload.student_code)
    print(f"student tree: {student_analysis}")
    optimal_analysis = analyze_code(payload.optimal_code)
    print(f"optimal tree: {optimal_analysis}")

    print(f"student analysis: {print_tree(student_analysis)}")
    print(f"target analysis: {print_tree(optimal_analysis)}")

    diffs = compare_ast(optimal_analysis, student_analysis)
    for d in diffs:
        print(d)

    generate_hints(diffs)
    feedback = generate_hints(diffs)
    return JSONResponse(content=feedback)

def generate_hints(diffs):
    feedback = {}

    for d in diffs:
        hint = None
        dtype = d['type']

        if dtype == "extra_child":
            hint = "Oh no! Seems like you've written more code than expected."

        elif dtype == "missing_child":
            hint = "Oh no! Seems like you've written lesser code than expected. One or more lines are missing."

        elif dtype == "iter_range_mismatch":
            hint = f"Oops! Looks like the iter range in one of your for loops seems to be wrong. It's probably this one: {d['found']}. Why don't you work on that?"

        elif dtype == "function_name_mismatch":
            hint = f"Oops! You'd better work on your naming conventions! How could you improve the name of function {d['found']}?"

        elif dtype == "call_func_mismatch":
            hint = f"You haven't called the right function at {d['found']}. It should be something else..."

        elif dtype == "call_args_mismatch":
            hint = f"You haven't passed the right arguments to your function! The wrong ones are: {d['found']}."

        elif dtype == "return_value_mismatch":
            hint = f"Your return statement seems a little off... What's really wrong with {d['found']}?"

        elif dtype == "condition_mismatch":
            hint = f"Oops! The conditional statement in your code is causing issues with test cases! How could you improve {d['found']}?"

        elif dtype == "assign_target_mismatch":
            hint = f"You haven't assigned your value to the right variable. What should {d['found']} really be assigned to?"
        
        elif dtype == "assign_value_mismatch":
            hint = f"You haven't assigned the right value to your variable. What should {d['found']} really be?"
        
        elif dtype == "type_mismatch":
            hint = f"You've accidentally used {d['found']} instead of what should be used."

        if hint and dtype not in feedback:
            feedback[dtype] = hint

    print("Generated Feedback:", feedback)
    return feedback

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)