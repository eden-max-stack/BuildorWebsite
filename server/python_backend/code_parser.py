import ast
import difflib

def get_function_logic(code):
    """Extracts function logic, ignoring function name differences."""
    tree = ast.parse(code)
    functions = {}

    class FunctionVisitor(ast.NodeVisitor):
        def visit_FunctionDef(self, node):
            function_body = "\n".join(ast.dump(stmt) for stmt in node.body)  # Convert list of statements
            functions[node.name] = function_body  
            self.generic_visit(node)

    FunctionVisitor().visit(tree)
    return functions

def extract_logic_structure(code):
    """Extracts logic flow from AST representation."""
    tree = ast.parse(code)
    logic_features = {
        "loops": [],
        "conditionals": [],
        "operations": [],
    }

    class CodeVisitor(ast.NodeVisitor):
        def visit_For(self, node):
            loop_data = {
                "iter": ast.dump(node.iter),  
                "body": [ast.dump(stmt) for stmt in node.body]  
            }
            logic_features["loops"].append(loop_data)
            self.generic_visit(node)

        def visit_While(self, node):
            loop_data = {
                "condition": ast.dump(node.test),  
                "body": [ast.dump(stmt) for stmt in node.body]
            }
            logic_features["loops"].append(loop_data)
            self.generic_visit(node)

        def visit_If(self, node):
            conditional_data = {
                "condition": ast.dump(node.test),  
                "body": [ast.dump(stmt) for stmt in node.body]
            }
            logic_features["conditionals"].append(conditional_data)
            self.generic_visit(node)

        def visit_BinOp(self, node):
            logic_features["operations"].append(ast.dump(node))  
            self.generic_visit(node)

    CodeVisitor().visit(tree)
    return logic_features

def compare_functions(student_code, optimal_code):
    """Compares functions logic-wise, ignoring names."""
    student_funcs = get_function_logic(student_code)
    optimal_funcs = get_function_logic(optimal_code)

    feedback = []

    if len(student_funcs) < len(optimal_funcs):
        feedback.append("Your implementation is missing required functions.")

    for opt_func in optimal_funcs.values():
        match_found = False
        for stud_func in student_funcs.values():
            similarity = difflib.SequenceMatcher(None, opt_func, stud_func).ratio()
            if similarity > 0.8:  
                match_found = True
                break
        if not match_found:
            feedback.append("Your function logic may be incorrect or incomplete.")

    return feedback

def compare_logic(student_code, optimal_code):
    """Compares student and optimal code logic-wise."""
    student_logic = extract_logic_structure(student_code)
    optimal_logic = extract_logic_structure(optimal_code)
    feedback = []

    if len(student_logic["loops"]) < len(optimal_logic["loops"]):
        feedback.append("You might need more loops to process data correctly.")

    for student_loop, optimal_loop in zip(student_logic["loops"], optimal_logic["loops"]):
        if student_loop["iter"] != optimal_loop["iter"]:
            feedback.append("Your loop iteration method may be incorrect.")

        if student_loop["body"] != optimal_loop["body"]:
            feedback.append("The operations inside your loop might be incorrect.")

    for student_cond, optimal_cond in zip(student_logic["conditionals"], optimal_logic["conditionals"]):
        if student_cond["condition"] != optimal_cond["condition"]:
            feedback.append("Your if-condition logic might need improvement.")

    if set(student_logic["operations"]) != set(optimal_logic["operations"]):
        feedback.append("You may be missing or using incorrect operations.")

    return feedback

def generate_feedback(student_code, optimal_code):
    """Combines function analysis and logic flow comparison."""
    feedback = []
    
    feedback.extend(compare_functions(student_code, optimal_code))  
    feedback.extend(compare_logic(student_code, optimal_code))  

    return feedback

# Example student and optimal solutions
student_code = """
def max_value(arr):
    max_num = arr[0]
    for num in arr:  
        if num >= max_num:  # mistake: should be '>'
            max_num = num
    return max_num
"""

optimal_code = """
def find_maximum(nums):
    max_val = float('-inf')
    for num in nums:
        if num > max_val:
            max_val = num
    return max_val
"""

# Run comparison
feedback = generate_feedback(student_code, optimal_code)
for line in feedback:
    print(line)
