export const createRowId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `row-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const parseValuesSimple = (valueStr: string): string[] => {
  const values: string[] = [];
  let current = "";
  let inString = false;
  let stringChar: string | null = null;
  let depth = 0;

  for (let i = 0; i < valueStr.length; i += 1) {
    const char = valueStr[i];
    const prevChar = i > 0 ? valueStr[i - 1] : "";

    if ((char === "'" || char === '"') && prevChar !== "\\") {
      if (!inString) {
        inString = true;
        stringChar = char;
        current += char;
      } else if (char === stringChar) {
        if (valueStr[i + 1] === stringChar) {
          current += char;
          i += 1;
          current += valueStr[i];
        } else {
          inString = false;
          stringChar = null;
          current += char;
        }
      } else {
        current += char;
      }
      continue;
    }

    if (!inString) {
      if (char === "(" || char === "[") {
        depth += 1;
      } else if (char === ")" || char === "]") {
        depth -= 1;
      }
    }

    if (char === "," && !inString && depth === 0) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    values.push(current.trim());
  }

  return values;
};
