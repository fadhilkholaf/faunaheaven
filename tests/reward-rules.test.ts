import assert from "node:assert/strict";
import test from "node:test";
import { quizReward } from "../src/lib/reward-rules";

test("perfect quiz earns the highest reward", () =>
    assert.equal(quizReward(3, 3), 50));
test("passing quiz earns the middle reward", () =>
    assert.equal(quizReward(2, 3), 25));
test("low score earns the participation reward", () =>
    assert.equal(quizReward(1, 3), 10));
test("empty quiz cannot mint coins", () => assert.equal(quizReward(0, 0), 0));
