class RiskMonitor:

    def __init__(self, positions):

        self.pos = positions

        self.total = sum(v["value"] for v in positions.values())



    def check_risk(self):

        warn = []

        for code, info in self.pos.items():

            ratio = info["value"] / self.total * 100

            if ratio > 20:

                warn.append(f"{code} 持仓占比 {ratio:.1f}%，偏高")

        return warn



    def report(self):

        warn = self.check_risk()

        if warn:

            return "⚠️ 风险提示：\n" + "\n".join(warn)

        return "✅ 持仓结构正常"