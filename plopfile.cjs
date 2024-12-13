const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const workspaces = ["components", "utils", "hooks"];
const generators = ["component", "util", "hook"];

const defaultOutDirs = {
  component: "components",
  hook: "hooks",
  util: "utils",
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
        ...(gen === "component"
          ? [
              {
                type: "list",
                name: "type",
                message: "请选择组件类型:",
                choices: ["tsx", "sfc"],
              },
            ]
          : []),
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
        console.log("answers", answers, gen);

        const { description, outDir, type } = answers;
        const generatorName = answers[`${gen}Name`] ?? "";
        const user = getGitUser();

        const data = {
          [`${gen}Name`]: generatorName,
          description,
          outDir,
          username: user.name,
          email: user.email,
          createAt: new Date().toISOString().split("T")[0],
        };

        let cmpType = "";
        if (type && type.length !== 0) {
          cmpType = "-" + type;
        }
        console.log("cmpType", gen + cmpType);

        actions.push({
          type: "addMany",
          templateFiles: `plop/${gen + cmpType}/**`,
          destination: `./packages/{{outDir}}/{{dashCase ${gen}Name}}`,
          base: `plop/${gen + cmpType}`,
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

        if (gen === "util") {
          actions.push({
            type: "append",
            path: "./packages/utils/index.ts",
            pattern: /$/g, // 匹配文件的末尾
            template: "export * from './{{utilName}}'",
          });
        }
        return actions;
      },
    });
  });
};

// 工具函数
function getGitUser() {
  try {
    const name = execSync("git config user.name", { encoding: "utf-8" }).trim();
    const email = execSync("git config user.email", {
      encoding: "utf-8",
    }).trim();
    const contributorsPath = path.resolve(__dirname, "contributors.json");
    let contributors = [];
    if (fs.existsSync(contributorsPath)) {
      contributors = JSON.parse(fs.readFileSync(contributorsPath, "utf-8"));
    }
    const existingContributor = contributors.find(
      (contributor) => contributor.name === name || contributor.email === email
    );
    if (!existingContributor) {
      contributors.push({
        name,
        email,
        contributions: 1,
        avatar: "",
      });
    } else {
      existingContributor.contributions =
        (existingContributor.contributions || 0) + 1;
    }
    fs.writeFileSync(
      contributorsPath,
      JSON.stringify(contributors, null, 2),
      "utf-8"
    );
    return { name, email };
  } catch (error) {
    console.error("Failed to get Git user:", error.message);
    return { user: "", email: "" };
  }
}

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const camelCase = (str) => {
  return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
};
