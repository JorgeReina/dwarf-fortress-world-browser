export default function LoaderPanel({ text }) {
  return (
    <div className="panel loader-wrap">
      <div>
        <div className="loader" />
        <div className="muted" style={{ marginTop: 16, textAlign: "center" }}>{text}</div>
      </div>
    </div>
  );
}
