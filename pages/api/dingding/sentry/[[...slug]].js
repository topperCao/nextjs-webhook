import axios from "axios";

export default async function handler(req, res) {
  try {
    var data = req.body || {};
    var mobile = req.query.mobile || "";
    var keyword = req.query.keyword || "前端监控报警";
    var level = req.query.level;
    if (level) {
      if (level === "all") {
        level = "";
      } else {
        if (typeof level === "string") {
          level = [level];
        }
      }

      if (!(level && level.includes(data.level))) {
        // 不是想要的level
        return res.send("webhook forward filtered");
      }
    }

    // var httpdata = data.event && data.event["sentry.interfaces.Http"];
    var httpdata = data.event;
    if (!httpdata) {
      return res.send("webhook forward filtered");
    }
    var httpLink = "";

    var tags = httpdata.tags;
    var tagsString = "";
    if (tags) {
      tagsString = tags
        .map((tag) => `- ${tag[0] || ""} => ${tag[1] || ""}`)
        .join("\n");
    }

    if (httpdata) {
      httpLink = `${httpdata.url}?${httpdata.query_string || ""}`;
    }

    var markdownText = `### [${keyword} : ${httpdata.title || "错误信息"}](${
      data.url
    })\n> ${data.project_name}  \n> [${
      data.culprit || "错误页面"
    }](${httpLink})  \n${tagsString}  \n  ${mobile ? '@'+mobile : ''}  \n`;

    console.log('data:', data)
    console.log('markdownText:', markdownText)

    await axios.post(req.query.url, {
      msgtype: "markdown",
      markdown: {
        title: httpdata.title,
        text: markdownText,
      },
      at: {
        atMobiles: [mobile],
        isAtAll: false,
      },
    });
    console.log("webhook forward success")
    res.send("webhook forward success");
  } catch (e) {
    console.log("dingding sentry axios post error :>> ", e);
    res.send("webhook forward failed");
  }
}
