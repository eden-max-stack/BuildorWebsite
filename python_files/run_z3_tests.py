import json
import subprocess
import tempfile
import os
import sys

def run_generate_z3(py_file, variables):
    """Run the generate_z3.py script with the given file and variables."""
    try:
        result = subprocess.run(
            [sys.executable, "generate_z3.py", py_file] + variables,
            capture_output=True,
            text=True
        )
        return result.stdout.strip(), result.stderr.strip()
    except Exception as e:
        return "", str(e)

def main():
    with open("code_snippets.json", "r") as f:
        test_cases = json.load(f)

    for i, case in enumerate(test_cases):
        code = case["code"]
        user_code = case["user_code"]
        variables = case["variables"]
        name = case.get("name", f"Test_{i}")

        with tempfile.NamedTemporaryFile(delete=False, suffix=".py", mode='w') as tmp:
            tmp.write(code + "\n")
            tmp_path = tmp.name

        print(f"\n=== Running {name} ===")
        stdout, stderr = run_generate_z3(tmp_path, variables)

        if stderr:
            print("Error:\n", stderr)
        else:
            print("Output:\n", stdout)

        os.remove(tmp_path)

if __name__ == "__main__":
    main()
