import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  TrendingDown,
  TrendingUp,
  History,
  Activity,
  Plus,
  Minus,
  ShieldCheck,
  Box,
  Landmark,
  Loader2,
} from "lucide-react";
import "./AssetPerformanceList.css";

const AssetPerformanceList = ({
  purchasesWithStock,
  SoldStock,
  onBuy,
  isProcessing,
}) => {
  const [activeTab, setActiveTab] = useState("buy_stock");
  const [selectedUnits, setSelectedUnits] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // ✅ 1. INTERNAL STATE FOR FLUCTUATION
  // We mirror props to local state so we can mutate prices for the UI
  const [displayAssets, setDisplayAssets] = useState([]);
  const timersRef = useRef({});

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // ✅ 2. SYNC PROPS TO LOCAL STATE
  useEffect(() => {
    const source =
      activeTab === "buy_stock" ? purchasesWithStock || [] : SoldStock || [];
    setDisplayAssets(source);
  }, [purchasesWithStock, SoldStock, activeTab]);

  // ✅ 3. FLUCTUATION ENGINE (The "Heartbeat")
  useEffect(() => {
    // Clear existing intervals
    Object.values(timersRef.current).forEach(clearInterval);
    timersRef.current = {};

    if (displayAssets.length > 0 && activeTab === "buy_stock") {
      displayAssets.forEach((asset) => {
        const stock = asset.stockDetails;
        if (!stock) return;

        const interval = stock.intervalTime || 3000;

     timersRef.current[asset.purchaseId] = setInterval(() => {
  setDisplayAssets((prev) =>
    prev.map((item) => {
      if (item.purchaseId !== asset.purchaseId) return item;

      const s = item.stockDetails;
      const min = Number(s.minPrice || 0);
      const max = Number(s.maxPrice || 10000);
      const current = Number(s.currentPrice || s.livePrice || min);

      // Simple Random Jump Logic
      const range = max - min;
      let nextPrice = min + (Math.random() * range);

      return {
        ...item,
        stockDetails: {
          ...s,
          currentPrice: nextPrice,
          trend: nextPrice >= current ? "UP" : "DOWN",
          priceChangePercent: ((nextPrice - min) / min) * 100,
          lastUpdated: new Date().toISOString(),
        },
      };
    }),
  );
}, interval);
      });
    }

    return () => Object.values(timersRef.current).forEach(clearInterval);
  }, [displayAssets, activeTab]);

  const adjustUnits = (amount, max) => {
    setSelectedUnits((prev) => {
      const next = prev + amount;
      return next < 0 ? 0 : next > max ? max : next;
    });
  };

  return (
    <div className="v-unit2">
      <div className="v-tabs">
        {["buy_stock", "sold"].map((tabId) => (
          <button
            key={tabId}
            onClick={() => {
              setActiveTab(tabId);
              setSelectedUnits(1);
            }}
            className={`v-tab ${activeTab === tabId ? "v-active" : ""}`}
          >
            {tabId.replace("_", " ")}
            {activeTab === tabId && <div className="v-glow-bar" />}
          </button>
        ))}
      </div>

      <div className="v-assets-body">
        {isInitialLoading && (
          <div className="loader-overlay">
            <div className="scanning-bar" />
            <Loader2
              size={32}
              className="animate-spin"
              style={{ color: "#22d3ee", opacity: 0.4 }}
            />
            <p
              style={{
                marginTop: 16,
                fontSize: 10,
                textTransform: "uppercase",
                fontWeight: 900,
                letterSpacing: "0.2em",
                color: "rgba(34,211,238,0.7)",
              }}
            >
              Syncing Market Ledger
            </p>
          </div>
        )}

        {!isInitialLoading &&
          displayAssets.map((asset, index) => (
            <div key={asset.purchaseId || index} className="v-asset-card">
              <div className="v-accent-border" />
              <div className="card-content">
                <div className="v-header-row">
                  <div className="v-asset-info">
                    <div className="v-bot-icon">
                      <Bot size={24} />
                    </div>
                    <div>
                      <h3 className="v-asset-name">
                        Asset:{" "}
                        {asset.stockName || asset.stockDetails?.companyName}
                      </h3>
                      <p className="v-stock-id">ID: {asset.stockId}</p>
                    </div>
                  </div>

                  <div className="v-unit-selector">
                    {activeTab === "buy_stock" ? (
                      <div className="unit-control">
                        <button
                          className="unit-btn border-r"
                          onClick={() => adjustUnits(-1, asset.leftStockUnits)}
                          disabled={selectedUnits <= 0}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="unit-display-text">
                          {selectedUnits} / {asset.leftStockUnits}
                        </span>
                        <button
                          className="unit-btn border-l"
                          onClick={() => adjustUnits(1, asset.leftStockUnits)}
                          disabled={selectedUnits >= asset.leftStockUnits}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="v-liquidated-badge">
                        FULLY LIQUIDATED
                      </span>
                    )}
                    <p className="v-disposal-label">Disposal Selection</p>
                  </div>
                </div>

                <div className="v-grid">
                  <div className="v-panel">
                    <div className="v-panel-header">
                      <div
                        className="v-panel-title"
                        style={{ color: "#f59e0b" }}
                      >
                        <History size={14} />
                        <span>Entry Data</span>
                      </div>
                      <div className="v-badge-row">
                        <span className="v-mini-badge badge-blue">
                          INITIAL:{" "}
                          {asset.totalStockUnits || asset.totalunits || 0}
                        </span>
                        <span className="v-mini-badge badge-green">
                          AVAILABLE:{" "}
                          {asset.leftStockUnits ??
                            asset.remainingUnitsAfterSell ??
                            0}
                        </span>
                      </div>
                    </div>

                    <div className="v-data-grid">
                      <div>
                        <p className="data-label">Single Unit Value</p>
                        <p className="data-value">
                          ₹
                          {(
                            asset.singleUnitValue ??
                            asset.soldPricePerUnit ??
                            0
                          ).toFixed(2)}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p
                          className="data-label"
                          style={{ justifyContent: "flex-end" }}
                        >
                          Total Units
                        </p>
                        <p className="data-value">
                          {asset.totalStockUnits || asset.totalunits || 0}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginTop: 16 }}>
                      <p className="data-label">
                        <Landmark size={10} style={{ marginRight: 4 }} /> Sold
                        Stock Amount
                      </p>
                      <p className="data-value text-rose">
                        ₹
                        {(
                          asset.soldStockAmount ??
                          asset.totalSoldAmount ??
                          0
                        ).toFixed(2)}
                      </p>
                    </div>

                    <div className="v-data-grid v-divider">
                      <div>
                        <p className="data-label">Purchase Date</p>
                        <p
                          style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}
                        >
                          {asset.purchaseDate
                            ? new Date(asset.purchaseDate).toLocaleDateString(
                                "en-IN",
                              )
                            : "N/A"}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p
                          className="data-label"
                          style={{ justifyContent: "flex-end" }}
                        >
                          Last Sold Date
                        </p>
                        <p
                          style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}
                        >
                          {asset.lastSoldDate || asset.soldDate
                            ? new Date(
                                asset.lastSoldDate || asset.soldDate,
                              ).toLocaleDateString("en-IN")
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div
                      className="v-divider"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="data-label">Status</span>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 900,
                            color: "#22d3ee",
                          }}
                        >
                          {asset.status || "ACTIVE"}
                        </span>
                      </div>
                      <div>
                        <span className="data-label">Purchase ID</span>
                        <span
                          style={{
                            fontSize: 9,
                            fontFamily: "monospace",
                            color: "#6b7280",
                            wordBreak: "break-all",
                          }}
                        >
                          {asset.purchaseId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="v-panel">
                    <div className="v-panel-header">
                      <div className="v-panel-title text-cyan">
                        <Activity size={14} />
                        <span>Market Status</span>
                      </div>
                    </div>

                    {(() => {
                      const stock = asset.stockDetails;
                      const currentPrice =
                        stock?.currentPrice || stock?.livePrice || 0;
                      const isUp = stock?.trend === "UP";
                      const trendColor = isUp ? "#10b981" : "#ef4444";

                      return (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>
                              <p className="data-label">Current Price</p>
                              <p
                                className="value-large"
                                style={{
                                  color: trendColor,
                                  transition: "all 0.3s ease",
                                }}
                              >
                                ₹
                                {currentPrice.toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <p className="data-label">Change %</p>
                              <div
                                style={{
                                  color: trendColor,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  justifyContent: "flex-end",
                                  fontWeight: 800,
                                }}
                              >
                                {isUp ? (
                                  <TrendingUp size={12} />
                                ) : (
                                  <TrendingDown size={12} />
                                )}
                                {stock?.priceChangePercent?.toFixed(2)}%
                              </div>
                            </div>
                          </div>

                          <div className="v-holding-box">
                            <p className="data-label">Est. Liquidation Value</p>
                            <p className="value-xl">
                              ₹
                              {(currentPrice * selectedUnits).toLocaleString(
                                "en-IN",
                                { minimumFractionDigits: 2 },
                              )}
                            </p>
                          </div>

                          {activeTab === "buy_stock" && (
                            <button
                              className="v-btn-sell"
                              onClick={() =>
                                onBuy(
                                  asset,
                                  selectedUnits,
                                  currentPrice * selectedUnits,
                                )
                              }
                              disabled={selectedUnits === 0 || isProcessing}
                              style={{
                                pointerEvents: isProcessing ? "none" : "auto",
                                cursor: isProcessing
                                  ? "not-allowed"
                                  : "pointer",
                                opacity: isProcessing ? 0.7 : 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                              }}
                            >
                              {isProcessing ? (
                                <>
                                  <Loader2 size={16} className="animate-spin" />{" "}
                                  Processing...
                                </>
                              ) : (
                                `SELL Stocks (${selectedUnits})`
                              )}
                            </button>
                          )}

                          <div className="v-footer-info">
                            <ShieldCheck size={12} />
                            <span style={{ fontSize: 9 }}>
                              Market Sync:{" "}
                              {stock?.lastUpdated
                                ? new Date(
                                    stock.lastUpdated,
                                  ).toLocaleTimeString("en-IN")
                                : "Live"}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ))}

        {!isInitialLoading && displayAssets.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "rgba(255,255,255,0.2)",
            }}
          >
            <Box size={40} style={{ margin: "0 auto 10px" }} />
            <p>No assets found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetPerformanceList;
