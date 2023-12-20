module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow service imports if the file content starts with 'useClient'",
      category: "Critical Security",
    },
    messages: {
      restrictedImport:
        'Importing services is not allowed in files starting with "useClient".',
    },
    schema: [],
  },
  create(context) {
    let fileStartsWithUseClient = false;

    return {
      Program: (node) => {
        const sourceCode = context.getSourceCode();
        const text = sourceCode.text;
        fileStartsWithUseClient = /^["']?\buse\s*client\b/i.test(text.trim());
      },

      ImportDeclaration: (node) => {
        if (!fileStartsWithUseClient) {
          return;
        }

        const pattern = /.*service$/;
        const importPath = node.source.value;

        const isImportingService = pattern.test(importPath);

        if (isImportingService) {
          context.report({
            node,
            message:
              "Importing services is not allowed in files starting with 'useClient'.",
            data: {
              importPath,
            },
          });
        }
      },
    };
  },
};
