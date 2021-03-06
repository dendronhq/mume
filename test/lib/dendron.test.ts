// import * as mume from "../../src/mume";
// import * as path from "path";
// import * as os from "os";
// import _ = require("lodash");
// import { DConfig, DendronEngineV2 } from "@dendronhq/engine-server";
// import {
//   AssertUtils,
//   NOTE_BODY_PRESETS_V4,
//   NOTE_PRESETS_V4,
// } from "@dendronhq/common-test-utils";
// import {
//   VaultUtils,
//   DEngineClient,
//   DVault,
//   WorkspaceOpts,
// } from "@dendronhq/common-all";

// process.env["LOG_LEVEL"] = "error";

// function hasOutline(out: { html: string }) {
//   return out.html.indexOf("portal-container") >= 0;
// }

// function createEngine(opts: WorkspaceOpts) {
//   return DendronEngineV2.create(opts);
// }

// async function createMdEngine(opts: {
//   projectDirectoryPath: string;
//   engine: DEngineClient;
//   fname: string;
// }) {
//   const configPath = path.resolve(os.homedir(), ".mume"); // use here your own config folder, default is "~/.mume"
//   await mume.init(configPath); // default uses "~/.mume"
//   const mdEngine = new mume.MarkdownEngine({
//     // need to set because we get vault based on filepath
//     filePath: path.join(opts.projectDirectoryPath, opts.fname),
//     projectDirectoryPath: opts.projectDirectoryPath,
//     config: {
//       configPath: configPath,
//       previewTheme: "github-light.css",
//       // revealjsTheme: "white.css"
//       codeBlockTheme: "default.css",
//       printBackground: true,
//       enableScriptExecution: true, // <= for running code chunks
//     },
//     engine: opts.engine,
//   });
//   return mdEngine;
// }

// async function parse(
//   text: string,
//   opts: {
//     engine: DEngineClient;
//     vaults: DVault[];
//     wsRoot: string;
//     fname: string;
//   },
// ) {
//   const { vaults, wsRoot, engine, fname } = opts;
//   const vault = vaults[0];
//   // const vpath = VaultUtils.normVaultPath({ wsRoot, vault });
//   const mdEngine = await createMdEngine({
//     projectDirectoryPath: path.join(wsRoot, vault.fsPath),
//     fname,
//     engine,
//   });
//   const out = await mdEngine.parseMD(text, {
//     isForPreview: false,
//     useRelativeFilePath: false,
//     hideFrontMatter: false,
//   });
//   return out;
// }

// const testOpts = {
//   expect,
//   createEngine,
//   preSetupHook: async ({ vaults, wsRoot }) => {
//     await DConfig.getOrCreate(wsRoot);
//   },
// };

// describe("MarkdownEngine", () => {
//   test("basic wiki link", async () => {
//     await runEngineTestV4(
//       async (opts) => {
//         const out = await parse("[[foo]]", { ...opts, fname: "foo" });
//         const wsRoot = opts.wsRoot;
//         const vpath = path.join(wsRoot, opts.vaults[0].fsPath);
//         expect(
//           await AssertUtils.assertInString({
//             body: out.html,
//             match: [`file://${vpath}/foo.md`],
//           }),
//         ).toBeTruthy();
//         return [];
//       },
//       {
//         ...testOpts,
//       },
//     );
//   });

//   test("image link", async () => {
//     await runEngineTestV4(
//       async (opts) => {
//         const out = await parse("![foo](foo.jpg)", { ...opts, fname: "foo" });
//         const wsRoot = opts.wsRoot;
//         const vpath = path.join(wsRoot, opts.vaults[0].fsPath);
//         expect(
//           await AssertUtils.assertInString({
//             body: out.html,
//             match: [`file://${vpath}/foo.jpg`],
//           }),
//         ).toBeTruthy();
//         return [];
//       },
//       {
//         ...testOpts,
//       },
//     );
//   });

//   test.skip("wiki link with space", async () => {
//     await runEngineTestV4(
//       async (opts) => {
//         const out = await parse("[[foo bar]]", { ...opts, fname: "foo" });
//         expect(out).toMatchSnapshot();
//         const wsRoot = opts.wsRoot;
//         const vpath = path.join(wsRoot, opts.vaults[0].fsPath);
//         expect(
//           await AssertUtils.assertInString({
//             body: out.html,
//             match: [`file://${vpath}/foo%20bar.md`],
//           }),
//         ).toBeTruthy();
//         return [];
//       },
//       {
//         ...testOpts,
//       },
//     );
//   });

//   test.skip("basic note ref", async () => {
//     await runEngineTestV4(
//       async (opts) => {
//         const fname = NOTE_PRESETS_V4.NOTE_WITH_NOTE_REF_TARGET.fname;
//         const txt = [
//           `![[${fname}]]`,
//           "---",
//           "",
//           "`code span`" + "some text",
//         ].join("\n");
//         const out = await parse(txt, { ...opts, fname });
//         expect(out).toMatchSnapshot();
//         expect(hasOutline(out)).toBeTruthy();
//         const match = NOTE_BODY_PRESETS_V4.NOTE_REF_TARGET_BODY.split("\n")
//           .map((ent) => _.trim(ent, "# "))
//           .concat(["alpha.md"]);
//         expect(
//           await AssertUtils.assertInString({ body: out.html, match }),
//         ).toBeTruthy();
//         return [];
//       },
//       {
//         ...testOpts,
//         preSetupHook: async ({ vaults, wsRoot }) => {
//           const vault = vaults[0];
//           await DConfig.getOrCreate(wsRoot);
//           await await NOTE_PRESETS_V4.NOTE_WITH_NOTE_REF_TARGET.create({
//             vault,
//             wsRoot,
//           });
//         },
//       },
//     );
//   });

//   test.skip("rel link", async () => {
//     await runEngineTestV4(
//       async (opts) => {
//         const out = await parse("[[foobar#rel-link]]", {
//           ...opts,
//           fname: "foo",
//         });
//         expect(out).toMatchSnapshot();
//         expect(out.html.indexOf('vault1/foobar.md"') >= 0).toBeTruthy();
//         return [];
//       },
//       {
//         ...testOpts,
//       },
//     );
//   });

//   test("math", async () => {
//     await runEngineTestV4(
//       async (opts) => {
//         const out = await parse(
//           [
//             "$$",
//             "i hbar \frac{partial Psi}{partial t} = - \frac{hbar^2}{2m} \frac{partial^2 Psi}{partial x^2} + V Psi",
//             "$$",
//           ].join("\n"),
//           { ...opts, fname: "foo" },
//         );
//         expect(out).toMatchSnapshot();
//         return [];
//       },
//       {
//         ...testOpts,
//       },
//     );
//   });

//   test.skip("with header", async () => {
//     await runEngineTestV4(
//       async ({ engine, vaults, wsRoot }) => {
//         const vault = vaults[0];
//         const fname = NOTE_PRESETS_V4.NOTE_WITH_NOTE_REF_TARGET.fname;
//         const vpath = VaultUtils.normVaultPath({ wsRoot, vault });
//         const mdEngine = await createMdEngine({
//           projectDirectoryPath: vpath,
//           engine,
//           fname,
//         });
//         const out = await mdEngine.parseMD(
//           [
//             `![[${fname}#Header1]]`,
//             "---",
//             "",
//             "`code span`" + "some text",
//           ].join("\n"),
//           {
//             isForPreview: false,
//             useRelativeFilePath: false,
//             hideFrontMatter: false,
//           },
//         );
//         expect(out).toMatchSnapshot();
//         expect(hasOutline(out)).toBeTruthy();
//         expect(
//           await AssertUtils.assertInString({
//             body: out.html,
//             match: ["Header1"],
//           }),
//         ).toBeTruthy();
//         return [];
//       },
//       {
//         expect,
//         createEngine,
//         preSetupHook: async ({ vaults, wsRoot }) => {
//           await DConfig.getOrCreate(wsRoot);
//           const vault = vaults[0];
//           await await NOTE_PRESETS_V4.NOTE_WITH_NOTE_REF_TARGET.create({
//             vault,
//             wsRoot,
//           });
//         },
//       },
//     );
//   });

//   test.skip("with header offset", async () => {
//     await runEngineTestV4(
//       async ({ engine, vaults, wsRoot }) => {
//         const vault = vaults[0];
//         const vpath = VaultUtils.normVaultPath({ wsRoot, vault });
//         const fname = NOTE_PRESETS_V4.NOTE_WITH_NOTE_REF_TARGET.fname;
//         const mdEngine = await createMdEngine({
//           projectDirectoryPath: vpath,
//           engine,
//           fname,
//         });
//         const out = await mdEngine.parseMD(
//           [
//             `((ref:[[${fname}]]#Header1,1))`,
//             "---",
//             "",
//             "`code span`" + "some text",
//           ].join("\n"),
//           {
//             isForPreview: false,
//             useRelativeFilePath: false,
//             hideFrontMatter: false,
//           },
//         );
//         expect(out).toMatchSnapshot();
//         expect(hasOutline(out)).toBeTruthy();
//         expect(
//           await AssertUtils.assertInString({
//             body: out.html,
//             nomatch: ["Header1"],
//           }),
//         ).toBeTruthy();
//         return [];
//       },
//       {
//         expect,
//         createEngine,
//         preSetupHook: async ({ vaults, wsRoot }) => {
//           const vault = vaults[0];
//           await DConfig.getOrCreate(wsRoot);
//           await await NOTE_PRESETS_V4.NOTE_WITH_NOTE_REF_TARGET.create({
//             vault,
//             wsRoot,
//           });
//         },
//       },
//     );
//   });

//   test.skip("with wildcard", async () => {
//     await runEngineTestV4(
//       async ({ engine, vaults, wsRoot }) => {
//         const vault = vaults[0];
//         const vpath = VaultUtils.normVaultPath({ wsRoot, vault });
//         const fname = NOTE_PRESETS_V4.NOTE_WITH_NOTE_REF_TARGET.fname;
//         const mdEngine = await createMdEngine({
//           projectDirectoryPath: vpath,
//           engine,
//           fname,
//         });
//         const out = await mdEngine.parseMD(
//           [
//             `((ref:[[${fname}]]#Header1:#*))`,
//             "---",
//             "",
//             "`code span`" + "some text",
//           ].join("\n"),
//           {
//             isForPreview: false,
//             useRelativeFilePath: false,
//             hideFrontMatter: false,
//           },
//         );
//         expect(out).toMatchSnapshot();
//         expect(hasOutline(out)).toBeTruthy();
//         expect(
//           await AssertUtils.assertInString({
//             body: out.html,
//             match: ["Header1"],
//             nomatch: ["Header2"],
//           }),
//         ).toBeTruthy();
//         return [];
//       },
//       {
//         expect,
//         createEngine,
//         preSetupHook: async ({ vaults, wsRoot }) => {
//           const vault = vaults[0];
//           await DConfig.getOrCreate(wsRoot);
//           await await NOTE_PRESETS_V4.NOTE_WITH_NOTE_REF_TARGET.create({
//             vault,
//             wsRoot,
//           });
//         },
//       },
//     );
//   });

//   describe("block ref", () => {
//     test("block ref link", async () => {
//       await runEngineTestV4(
//         async (opts) => {
//           const fname = NOTE_PRESETS_V4.NOTE_WITH_BLOCK_ANCHOR_TARGET.fname;
//           const out = await parse(`[[${fname}#^block-id]]`, { ...opts, fname });
//           const wsRoot = opts.wsRoot;
//           const vpath = path.join(wsRoot, opts.vaults[0].fsPath);
//           expect(
//             await AssertUtils.assertInString({
//               body: out.html,
//               match: [`file://${vpath}/anchor-target.md`],
//             }),
//           ).toBeTruthy();
//           return [];
//         },
//         {
//           ...testOpts,
//           preSetupHook: async ({ vaults, wsRoot }) => {
//             const vault = vaults[0];
//             await await NOTE_PRESETS_V4.NOTE_WITH_BLOCK_ANCHOR_TARGET.create({
//               vault,
//               wsRoot,
//             });
//           },
//         },
//       );
//     });

//     test("block ref ref", async () => {
//       await runEngineTestV4(
//         async (opts) => {
//           const fname = NOTE_PRESETS_V4.NOTE_WITH_BLOCK_ANCHOR_TARGET.fname;
//           const out = await parse(`![[${fname}#^block-id]]`, {
//             ...opts,
//             fname,
//           });
//           expect(
//             await AssertUtils.assertInString({
//               body: out.html,
//               match: ["Lorem ipsum dolor amet"],
//             }),
//           ).toBeTruthy();
//           return [];
//         },
//         {
//           ...testOpts,
//           preSetupHook: async ({ vaults, wsRoot }) => {
//             const vault = vaults[0];
//             await await NOTE_PRESETS_V4.NOTE_WITH_BLOCK_ANCHOR_TARGET.create({
//               vault,
//               wsRoot,
//             });
//           },
//         },
//       );
//     });
//   });
// });
