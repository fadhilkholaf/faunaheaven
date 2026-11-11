export function quizReward(score: number, total: number) {
    if (total <= 0) return 0;
    if (score === total) return 50;
    if (score >= Math.ceil(total / 2)) return 25;
    return 10;
}
