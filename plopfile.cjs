/**
 * Part of this code is taken from @chakra-ui/react package ❤️
 */

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const camelCase = (str) => {
  return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
};

const workspaces = ["components", "hooks"];
const generators = ["component", "hook"];

const defaultOutDirs = {
  component: "components",
  hook: "hooks",
};

/**
 * @param {import("plop").NodePlopAPI} plop
 */
module.exports = function main(plop) {
  plop.setHelper("capitalize", (text) => {
    return capitalize(camelCase(text));
  });
  plop.setHelper("camelCase", (text) => {
    return camelCase(text);
  });

  generators.forEach((gen) => {
    plop.setGenerator(gen, {
      description: `生成一个${gen}`,
      prompts: [
        {
          type: "input",
          name: `${gen}Name`,
          message: `请输入${gen}的名字:`,

          validate: (value) => {
            if (!value) {
              return `${gen}的名字是必须的`;
            }

            // check is has a valid hook name "use-something"
            if (gen === "hook" && !value.startsWith("use-")) {
              return "hooks 必须以'use-'开始";
            }

            // check is case is correct
            if (value !== value.toLowerCase()) {
              return `${gen}的名字必须小写`;
            }

            // cannot have spaces
            if (value.includes(" ")) {
              return `${gen}的名字不能有空格`;
            }

            return true;
          },
        },
        {
          type: "input",
          name: "description",
          message: `The description of this ${gen}:`,
        },
        {
          type: "list",
          name: "outDir",
          message: `where should this ${gen} live?`,
          default: defaultOutDirs[gen],
          choices: workspaces,
          validate: (value) => {
            if (!value) {
              return `outDir is required`;
            }

            return true;
          },
        },
      ],
      actions(answers) {
        const actions = [];

        if (!answers) return actions;
        console.log("answers", answers);

        const { description, outDir } = answers;
        const generatorName = answers[`${gen}Name`] ?? "";

        const data = {
          [`${gen}Name`]: generatorName,
          description,
          outDir,
        };

        console.log(data);

        actions.push({
          type: "addMany",
          templateFiles: `plop/${gen}/**`,
          destination: `./packages/{{outDir}}/{{dashCase ${gen}Name}}`,
          base: `plop/${gen}`,
          data,
          abortOnFail: true,
        });

        //添加docs
        if (gen === "component") {
          // packages/components/index.ts 添加组件导出

          actions.push({
            type: "append",
            path: "./packages/components/index.ts",
            pattern: /$/g, // 匹配文件的末尾
            template: "export * from './{{componentName}}'",
          });
          actions.push({
            type: "addMany",
            templateFiles: `plop/docs/component/**`,
            destination: `./packages/docs/components`,
            base: `plop/docs/component`,
            data,
            abortOnFail: true,
          });
          actions.push({
            type: "addMany",
            templateFiles: `plop/docs/demo/**`,
            destination: `./packages/docs/demo`,
            base: `plop/docs/demo`,
            data,
            abortOnFail: true,
          });
        }
        return actions;
      },
    });
  });
};
