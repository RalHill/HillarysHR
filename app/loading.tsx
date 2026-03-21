export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf9f7",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header skeleton */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              height: "20px",
              background: "#e8e6e1",
              width: "200px",
              borderRadius: "4px",
              marginBottom: "12px",
            }}
          />
          <div
            style={{
              height: "48px",
              background: "#e8e6e1",
              width: "300px",
              borderRadius: "4px",
              marginBottom: "16px",
            }}
          />
        </div>

        {/* Ticker skeleton */}
        <div
          style={{
            height: "32px",
            background: "#e8e6e1",
            marginBottom: "28px",
            borderRadius: "4px",
          }}
        />

        {/* Grid skeleton */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                border: "1px solid #e8e6e1",
                borderRadius: "4px",
                padding: "20px",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            >
              <div
                style={{
                  height: "16px",
                  background: "#e8e6e1",
                  borderRadius: "4px",
                  marginBottom: "12px",
                  width: "100px",
                }}
              />
              <div
                style={{
                  height: "20px",
                  background: "#e8e6e1",
                  borderRadius: "4px",
                  marginBottom: "12px",
                  width: "80%",
                }}
              />
              <div
                style={{
                  height: "60px",
                  background: "#e8e6e1",
                  borderRadius: "4px",
                }}
              />
            </div>
          ))}
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    </div>
  );
}
