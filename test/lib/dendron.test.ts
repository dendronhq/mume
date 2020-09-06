import * as mume from "../../src/mume";
import * as path from "path";
import * as os from "os";

describe("gen", () => {
  test("basic", () => {
    expect(1).toEqual(1);
  });
});

describe("MarkdownEngine", () => {
  test("basic", async () => {
    const configPath = path.resolve(os.homedir(), ".mume"); // use here your own config folder, default is "~/.mume"
    await mume.init(configPath); // default uses "~/.mume"
    const engine = new mume.MarkdownEngine({
      filePath: "./test/integration/fixtures/dendron/ref.md",
      projectDirectoryPath: "./test/integration/fixtures/dendron",
      config: {
        configPath: configPath,
        previewTheme: "github-light.css",
        // revealjsTheme: "white.css"
        codeBlockTheme: "default.css",
        printBackground: true,
        enableScriptExecution: true, // <= for running code chunks
      },
    });
    const out = await engine.parseMD(
      ["((ref:[[ref]]))", "---", "", "`code span`" + "some text"].join("\n"),
      {
        isForPreview: false,
        useRelativeFilePath: false,
        hideFrontMatter: false,
      },
    );
    expect(out).toMatchSnapshot();
  });

  test("with header", async () => {
    const configPath = path.resolve(os.homedir(), ".mume"); // use here your own config folder, default is "~/.mume"
    await mume.init(configPath); // default uses "~/.mume"
    const engine = new mume.MarkdownEngine({
      filePath: "./test/integration/fixtures/dendron/ref.md",
      projectDirectoryPath: "./test/integration/fixtures/dendron",
      config: {
        configPath: configPath,
        previewTheme: "github-light.css",
        // revealjsTheme: "white.css"
        codeBlockTheme: "default.css",
        printBackground: true,
        enableScriptExecution: true, // <= for running code chunks
      },
    });
    const out = await engine.parseMD(
      [
        "((ref:[[ref]]#h2 header))",
        "---",
        "",
        "`code span`" + "some text",
      ].join("\n"),
      {
        isForPreview: false,
        useRelativeFilePath: false,
        hideFrontMatter: false,
      },
    );
    expect(out).toMatchSnapshot();
    expect(out.html.indexOf("h1 header") < 0).toBeTruthy();
    expect(out.html.indexOf("h2 header") < 0).toBeFalsy();
  });

  test("with header offset", async () => {
    const configPath = path.resolve(os.homedir(), ".mume"); // use here your own config folder, default is "~/.mume"
    await mume.init(configPath); // default uses "~/.mume"
    const engine = new mume.MarkdownEngine({
      filePath: "./test/integration/fixtures/dendron/ref.md",
      projectDirectoryPath: "./test/integration/fixtures/dendron",
      config: {
        configPath: configPath,
        previewTheme: "github-light.css",
        // revealjsTheme: "white.css"
        codeBlockTheme: "default.css",
        printBackground: true,
        enableScriptExecution: true, // <= for running code chunks
      },
    });
    const out = await engine.parseMD(
      [
        "((ref:[[ref]]#h2 header,1))",
        "---",
        "",
        "`code span`" + "some text",
      ].join("\n"),
      {
        isForPreview: false,
        useRelativeFilePath: false,
        hideFrontMatter: false,
      },
    );
    expect(out).toMatchSnapshot();
    expect(out.html.indexOf("h1 header") < 0).toBeTruthy();
    expect(out.html.indexOf("h2 header") < 0).toBeTruthy();
  });
});
