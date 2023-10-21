import { describe, expect, test } from "@jest/globals";
import { mockSupporter } from "../../../tests/mockSupporter";
import { createSupporter } from "./supporters.service";

describe("sum module", () => {
  test("tests supporter creation", async () => {
    for (let index = 0; index < 350; index++) {
      await createSupporter(
        await mockSupporter(
          "4e3ccb3a-bcb8-45bf-8144-2aa79c5c8213",
          "db383fb0-7293-4ece-a95c-90c22433582a"
        )
      );
    }
  });
});
