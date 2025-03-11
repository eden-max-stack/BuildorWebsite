import * as esprima from "esprima";

// ✅ Use Esprima for JavaScript Validation
function isValidJavaScript(code: string): boolean {
  try {
    esprima.parseScript(code, { tolerant: true, ecmaVersion: 2020 });
    return true;
  } catch (e) {
    console.error("JavaScript Validation Error:", e);
    return false;
  }
}

// ✅ Extract function logic from JavaScript code
function getFunctionLogic(code: string) {
  if (!isValidJavaScript(code)) {
    console.error("Invalid JavaScript code submitted.");
    return {};
  }

  let ast;
  try {
    ast = esprima.parseScript(code, { tolerant: true, ecmaVersion: 2020 });
  } catch (error) {
    console.error("Esprima Parsing Error:", error);
    return {};
  }

  const functions: Record<string, string> = {};

  function traverse(node: any) {
    if (node.type === "FunctionDeclaration" && node.id) {
      functions[node.id.name] = JSON.stringify(node.body, null, 2);
    }

    for (const key in node) {
      if (
        Object.prototype.hasOwnProperty.call(node, key) &&
        typeof node[key] === "object" &&
        node[key] !== null
      ) {
        traverse(node[key]);
      }
    }
  }

  traverse(ast);
  return functions;
}

// ✅ Extract logic structure (loops, conditions, operations)
function extractLogicStructure(code: string) {
  if (!isValidJavaScript(code)) {
    console.error("Invalid JavaScript code submitted.");
    return { loops: [], conditionals: [], operations: [] };
  }

  let ast;
  try {
    ast = esprima.parseScript(code, { tolerant: true, ecmaVersion: 2020 });
  } catch (error) {
    console.error("Esprima Parsing Error:", error);
    return { loops: [], conditionals: [], operations: [] };
  }

  const logicFeatures: any = { loops: [], conditionals: [], operations: [] };

  function traverse(node: any) {
    if (node.type === "ForStatement" || node.type === "WhileStatement") {
      logicFeatures.loops.push(JSON.stringify(node));
    }

    if (node.type === "IfStatement") {
      logicFeatures.conditionals.push(JSON.stringify(node.test));
    }

    if (node.type === "BinaryExpression") {
      logicFeatures.operations.push(JSON.stringify(node));
    }

    for (const key in node) {
      if (
        Object.prototype.hasOwnProperty.call(node, key) &&
        typeof node[key] === "object" &&
        node[key] !== null
      ) {
        traverse(node[key]);
      }
    }
  }

  traverse(ast);
  return logicFeatures;
}

// ✅ Compare functions in student and optimal code
function compareFunctions(studentCode: string, optimalCode: string) {
  const studentFuncs = getFunctionLogic(studentCode);
  const optimalFuncs = getFunctionLogic(optimalCode);
  const feedback: string[] = [];

  if (Object.keys(studentFuncs).length < Object.keys(optimalFuncs).length) {
    feedback.push("Your implementation is missing required functions.");
  }

  for (const optFunc in optimalFuncs) {
    let matchFound = false;
    for (const studFunc in studentFuncs) {
      const similarity =
        studentFuncs[studFunc] === optimalFuncs[optFunc] ? 1 : 0;
      if (similarity > 0.8) {
        matchFound = true;
        break;
      }
    }
    if (!matchFound) {
      feedback.push(`Function "${optFunc}" logic might be incorrect.`);
    }
  }

  return feedback;
}

// ✅ Compare logic structures
function compareLogic(studentCode: string, optimalCode: string) {
  const studentLogic = extractLogicStructure(studentCode);
  const optimalLogic = extractLogicStructure(optimalCode);
  const feedback: string[] = [];

  if (studentLogic.loops.length < optimalLogic.loops.length) {
    feedback.push("You might need more loops to process data correctly.");
  }

  if (
    JSON.stringify(studentLogic.conditionals) !==
    JSON.stringify(optimalLogic.conditionals)
  ) {
    feedback.push("Your conditional logic might be incorrect.");
  }

  if (
    JSON.stringify(studentLogic.operations) !==
    JSON.stringify(optimalLogic.operations)
  ) {
    feedback.push("You may be missing or using incorrect operations.");
  }

  return feedback;
}

// ✅ Generate feedback by comparing function logic and structure
export function generateFeedback(studentCode: string, optimalCode: string) {
  return [
    ...compareFunctions(studentCode, optimalCode),
    ...compareLogic(studentCode, optimalCode),
  ];
}
