import * as mume from "../../src/mume";
import * as path from "path";
import * as os from "os";
import _ = require("lodash");
import { DendronEngineV2 } from "@dendronhq/engine-server";
import {
  AssertUtils,
  NOTE_BODY_PRESETS_V4,
  NOTE_PRESETS_V4,
  runEngineTestV4,
} from "@dendronhq/common-test-utils";
import {
  VaultUtils,
  DEngineClientV2,
  DVault,
  WorkspaceOpts,
} from "@dendronhq/common-all";

function hasOutline(out: { html: string }) {
  return out.html.indexOf("portal-container") >= 0;
}

function createEngine(opts: WorkspaceOpts) {
  return DendronEngineV2.createV3(opts);
}

async function createMdEngine(opts: {
  projectDirectoryPath: string;
  engine: DEngineClientV2;
}) {
  const configPath = path.resolve(os.homedir(), ".mume"); // use here your own config folder, default is "~/.mume"
  await mume.init(configPath); // default uses "~/.mume"
  debugger;
  const mdEngine = new mume.MarkdownEngine({
    // need to set because we get vault based on filepath
    filePath: path.join(opts.projectDirectoryPath, "stub"),
    projectDirectoryPath: opts.projectDirectoryPath,
    config: {
      configPath: configPath,
      previewTheme: "github-light.css",
      // revealjsTheme: "white.css"
      codeBlockTheme: "default.css",
      printBackground: true,
      enableScriptExecution: true, // <= for running code chunks
    },
    engine: opts.engine,
  });
  return mdEngine;
}

async function parse(
  text: string,
  opts: { engine: DEngineClientV2; vaults: DVault[]; wsRoot: string },
) {
  const { vaults, wsRoot, engine } = opts;
  const vault = vaults[0];
  // const vpath = VaultUtils.normVaultPath({ wsRoot, vault });
  const mdEngine = await createMdEngine({
    projectDirectoryPath: path.join(wsRoot, vault.fsPath),
    engine,
  });
  const out = await mdEngine.parseMD(text, {
    isForPreview: false,
    useRelativeFilePath: false,
    hideFrontMatter: false,
  });
  return out;
}

const testOpts = {
  expect,
  createEngine,
};

describe.only("MarkdownEngine", () => {
  test("basic wiki link", async () => {
    await runEngineTestV4(
      async (opts) => {
        const out = await parse("[[foo]]", opts);
        expect(out).toMatchSnapshot();
        const wsRoot = opts.wsRoot;
        const vpath = path.join(wsRoot, opts.vaults[0].fsPath);
        expect(
          await AssertUtils.assertInString({
            body: out.html,
            match: [`file://${vpath}/foo.md`],
          }),
        ).toBeTruthy();
        return [];
      },
      {
        ...testOpts,
      },
    );
  });

  test("basic", async () => {
    await runEngineTestV4(
      async (opts) => {
        const txt = [
          `((ref:[[${NOTE_PRESETS_V4.NOTE_WITH_NOTE_REF_TARGET.fname}]]))`,
          "---",
          "",
          "`code span`" + "some text",
        ].join("\n");
        const out = await parse(txt, opts);
        expect(out).toMatchSnapshot();
        expect(hasOutline(out)).toBeTruthy();
        const match = NOTE_BODY_PRESETS_V4.NOTE_REF_TARGET_BODY.split("\n")
          .map((ent) => _.trim(ent, "# "))
          .concat(["alpha.md"]);
        expect(
          await AssertUtils.assertInString({ body: out.html, match }),
        ).toBeTruthy();
        return [];
      },
      {
        ...testOpts,
        preSetupHook: async ({ vaults, wsRoot }) => {
          const vault = vaults[0];
          await await NOTE_PRESETS_V4.NOTE_WITH_NOTE_REF_TARGET.create({
            vault,
            wsRoot,
          });
        },
      },
    );
  });

  test("rel link", async () => {
    await runEngineTestV4(
      async (opts) => {
        const out = await parse("[[foobar#rel-link]]", opts);
        expect(out).toMatchSnapshot();
        expect(out.html.indexOf('vault1/foobar.md"') >= 0).toBeTruthy();
        return [];
      },
      {
        ...testOpts,
      },
    );
  });

  test("with header", async () => {
    await runEngineTestV4(
      async ({ engine, vaults, wsRoot }) => {
        const vault = vaults[0];
        const vpath = VaultUtils.normVaultPath({ wsRoot, vault });
        const mdEngine = await createMdEngine({
          projectDirectoryPath: vpath,
          engine,
        });
        const out = await mdEngine.parseMD(
          [
            `((ref:[[${NOTE_PRESETS_V4.NOTE_WITH_NOTE_REF_TARGET.fname}]]#Header1))`,
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
        expect(
          await AssertUtils.assertInString({
            body: out.html,
            match: ["Header1", "Header2"],
          }),
        ).toBeTruthy();
        return [];
      },
      {
        expect,
        createEngine,
        preSetupHook: async ({ vaults, wsRoot }) => {
          const vault = vaults[0];
          await await NOTE_PRESETS_V4.NOTE_WITH_NOTE_REF_TARGET.create({
            vault,
            wsRoot,
          });
        },
      },
    );
  });

  test("with header offset", async () => {
    await runEngineTestV4(
      async ({ engine, vaults, wsRoot }) => {
        const vault = vaults[0];
        const vpath = VaultUtils.normVaultPath({ wsRoot, vault });
        const mdEngine = await createMdEngine({
          projectDirectoryPath: vpath,
          engine,
        });
        const out = await mdEngine.parseMD(
          [
            `((ref:[[${NOTE_PRESETS_V4.NOTE_WITH_NOTE_REF_TARGET.fname}]]#Header1,1))`,
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
        expect(
          await AssertUtils.assertInString({
            body: out.html,
            match: ["Header2"],
            nomatch: ["Header1"],
          }),
        ).toBeTruthy();
        return [];
      },
      {
        expect,
        createEngine,
        preSetupHook: async ({ vaults, wsRoot }) => {
          const vault = vaults[0];
          await await NOTE_PRESETS_V4.NOTE_WITH_NOTE_REF_TARGET.create({
            vault,
            wsRoot,
          });
        },
      },
    );
  });

  test("with wildcard", async () => {
    await runEngineTestV4(
      async ({ engine, vaults, wsRoot }) => {
        const vault = vaults[0];
        const vpath = VaultUtils.normVaultPath({ wsRoot, vault });
        const mdEngine = await createMdEngine({
          projectDirectoryPath: vpath,
          engine,
        });
        const out = await mdEngine.parseMD(
          [
            `((ref:[[${NOTE_PRESETS_V4.NOTE_WITH_NOTE_REF_TARGET.fname}]]#Header1:#*))`,
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
        expect(
          await AssertUtils.assertInString({
            body: out.html,
            match: ["Header1"],
            nomatch: ["Header2"],
          }),
        ).toBeTruthy();
        return [];
      },
      {
        expect,
        createEngine,
        preSetupHook: async ({ vaults, wsRoot }) => {
          const vault = vaults[0];
          await await NOTE_PRESETS_V4.NOTE_WITH_NOTE_REF_TARGET.create({
            vault,
            wsRoot,
          });
        },
      },
    );
  });
});
