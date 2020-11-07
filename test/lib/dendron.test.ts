import * as mume from "../../src/mume";
import * as path from "path";
import * as os from "os";

function hasOutline(out: { html: string }) {
  return out.html.indexOf("portal-container") >= 0;
}

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
      engine: {} as any,
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
    expect(hasOutline(out)).toBeTruthy();
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
      engine: {} as any,
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
    expect(hasOutline(out)).toBeTruthy();
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
      engine: {} as any,
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
    expect(hasOutline(out)).toBeTruthy();
    expect(out.html.indexOf("h1 header") < 0).toBeTruthy();
    expect(out.html.indexOf("h2 header") < 0).toBeTruthy();
  });

  test("with wildcard", async () => {
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
      engine: {} as any,
    });
    const out = await engine.parseMD(
      [
        "((ref:[[ref]]#h1 header,1:#*))",
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
    expect(out.html).toMatchSnapshot();
    expect(hasOutline(out)).toBeTruthy();
    expect(out.html.indexOf("h1 header") < 0).toBeTruthy();
    expect(out.html.indexOf("h2 header") < 0).toBeTruthy();
  });

  test("without outline ", async () => {
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
        renderRefWithOutline: false,
      },
      engine: {} as any,
    });
    const out = await engine.parseMD(
      [
        "((ref:[[ref]]#h1 header,1:#*))",
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
    expect(out.html).toMatchSnapshot();
    expect(hasOutline(out)).toBeFalsy();
    expect(out.html.indexOf("h1 header") < 0).toBeTruthy();
    expect(out.html.indexOf("h2 header") < 0).toBeTruthy();
  });
});
