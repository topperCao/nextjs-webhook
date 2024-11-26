const htmlStr = `
<p>sentry webhooks by next.js</p>
`;

export default function Home() {
  return (
    <div className="container">
      <main>
        <div dangerouslySetInnerHTML={{ __html: htmlStr }}></div>
      </main>
    </div>
  );
}
