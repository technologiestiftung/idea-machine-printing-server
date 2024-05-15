import { describe, it } from "node:test";
import assert from "node:assert";
import childProcess from "child_process";

describe("services/browser", () => {
	it("should open the idea-machine admin panel on import", async (t) => {
		const mockedExecSync = t.mock.method(childProcess, "execSync");
		mockedExecSync.mock.mockImplementationOnce(() => {});

		await import("./browser.js");

		const actual = mockedExecSync.mock.calls[0].arguments[0];
		const expected = "open index.html";

		assert.strictEqual(actual, expected);
	});
});
