import React, { useState, useEffect, useRef } from 'react';
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  BarChart2,
  TrendingUp,
  PlusCircle,
  Trash2,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Move,
  Ruler,
  Compass,
  Palette,
  Check,
  X,
  Layers,
  HelpCircle,
  Flame,
} from 'lucide-react';
import {
  OHLCVCandle,
  SupportResistanceLevels,
  Timeframe,
  ChartToolType,
  ChartTrendline,
  CustomLevel,
  ChartMeasurement,
} from '../types';

interface PriceChartProps {
  candles: OHLCVCandle[];
  selectedTimeframe: Timeframe;
  onSelectTimeframe: (tf: Timeframe) => void;
  supportResistance: SupportResistanceLevels;
}

const STORAGE_KEY = 'xau_interactive_chart_drawings_v1';

export const PriceChart: React.FC<PriceChartProps> = ({
  candles,
  selectedTimeframe,
  onSelectTimeframe,
  supportResistance,
}) => {
  // Indicator Toggles
  const [showEMA20, setShowEMA20] = useState(true);
  const [showEMA50, setShowEMA50] = useState(true);
  const [showEMA200, setShowEMA200] = useState(false);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showRSI, setShowRSI] = useState(false);
  const [chartType, setChartType] = useState<'area' | 'candles'>('candles');

  // Drawing Tools State
  const [activeTool, setActiveTool] = useState<ChartToolType>('CURSOR');
  const [trendlines, setTrendlines] = useState<ChartTrendline[]>([]);
  const [customLevels, setCustomLevels] = useState<CustomLevel[]>([]);
  const [measurement, setMeasurement] = useState<ChartMeasurement | null>(null);

  // In-progress drawing temp state
  const [pendingTrendStart, setPendingTrendStart] = useState<{
    index: number;
    time: string;
    price: number;
    x: number;
    y: number;
  } | null>(null);

  const [mousePos, setMousePos] = useState<{ x: number; y: number; price: number; time: string; index: number } | null>(null);
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(null);
  const [showAddLevelModal, setShowAddLevelModal] = useState(false);
  const [showDrawingsList, setShowDrawingsList] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Manual Level Form Inputs
  const [manualPriceInput, setManualPriceInput] = useState<string>('');
  const [manualLevelType, setManualLevelType] = useState<'SUPPORT' | 'RESISTANCE' | 'KEY_LEVEL'>('SUPPORT');
  const [manualLabelInput, setManualLabelInput] = useState<string>('دعم مخصص');
  const [manualColor, setManualColor] = useState<string>('#10b981');

  // Chart Container and coordinate boundaries
  const chartWrapperRef = useRef<HTMLDivElement | null>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 800, height: 380 });

  const timeframes: { tf: Timeframe; label: string }[] = [
    { tf: '15m', label: '15 دقيقة' },
    { tf: '1h', label: 'ساعة' },
    { tf: '4h', label: '4 ساعات' },
    { tf: '1D', label: 'يومي' },
    { tf: '1W', label: 'أسبوعي' },
  ];

  // Colors available for drawings
  const colorOptions = [
    { name: 'أخضر (دعم)', value: '#10b981' },
    { name: 'أحمر (مقاومة)', value: '#f43f5e' },
    { name: 'ذهبي / أصفر', value: '#fbbf24' },
    { name: 'أزرق سماوي', value: '#38bdf8' },
    { name: 'بنفسجي', value: '#c084fc' },
    { name: 'أبيض ناصع', value: '#ffffff' },
  ];

  // Load Saved Drawings from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.trendlines && Array.isArray(parsed.trendlines)) {
          setTrendlines(parsed.trendlines);
        }
        if (parsed.customLevels && Array.isArray(parsed.customLevels)) {
          setCustomLevels(parsed.customLevels);
        }
      }
    } catch (e) {
      console.warn('Failed to load chart drawings from localStorage', e);
    }
  }, []);

  // Save Drawings to LocalStorage
  const saveDrawings = (updatedTrendlines: ChartTrendline[], updatedLevels: CustomLevel[]) => {
    setTrendlines(updatedTrendlines);
    setCustomLevels(updatedLevels);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          trendlines: updatedTrendlines,
          customLevels: updatedLevels,
        })
      );
    } catch (e) {
      console.warn('Failed to save chart drawings to localStorage', e);
    }
  };

  // Observe chart resizing
  useEffect(() => {
    if (!chartWrapperRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setChartDimensions({
            width: entry.contentRect.width || 800,
            height: entry.contentRect.height || 380,
          });
        }
      }
    });
    observer.observe(chartWrapperRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculate min and max for Y-Axis padding (including custom levels)
  const closes = candles.map(c => c.close);
  const highs = candles.map(c => c.high || c.close);
  const lows = candles.map(c => c.low || c.close);
  const customPrices = customLevels.map(l => l.price);
  const trendPrices = trendlines.flatMap(t => [t.startPrice, t.endPrice]);

  const allPrices = [...closes, ...highs, ...lows, ...customPrices, ...trendPrices];
  const minRaw = allPrices.length ? Math.min(...allPrices) : 2600;
  const maxRaw = allPrices.length ? Math.max(...allPrices) : 2700;
  const priceMargin = Math.max(10, (maxRaw - minRaw) * 0.08);

  const minPrice = Math.floor(minRaw - priceMargin);
  const maxPrice = Math.ceil(maxRaw + priceMargin);

  // Margins used inside Recharts ComposedChart
  const chartMargin = { top: 15, right: 60, left: 15, bottom: 25 };

  // Coordinate Conversion Helpers
  const priceToY = (price: number): number => {
    const usableHeight = chartDimensions.height - chartMargin.top - chartMargin.bottom;
    const ratio = (maxPrice - price) / (maxPrice - minPrice);
    return chartMargin.top + Math.max(0, Math.min(usableHeight, ratio * usableHeight));
  };

  const yToPrice = (y: number): number => {
    const usableHeight = chartDimensions.height - chartMargin.top - chartMargin.bottom;
    const clampedY = Math.max(chartMargin.top, Math.min(chartDimensions.height - chartMargin.bottom, y));
    const ratio = (clampedY - chartMargin.top) / usableHeight;
    const price = maxPrice - ratio * (maxPrice - minPrice);
    return Number(price.toFixed(2));
  };

  const indexToX = (index: number): number => {
    if (candles.length <= 1) return chartMargin.left;
    const usableWidth = chartDimensions.width - chartMargin.left - chartMargin.right;
    const clampedIndex = Math.max(0, Math.min(candles.length - 1, index));
    return chartMargin.left + (clampedIndex / (candles.length - 1)) * usableWidth;
  };

  const xToIndex = (x: number): number => {
    if (candles.length <= 1) return 0;
    const usableWidth = chartDimensions.width - chartMargin.left - chartMargin.right;
    const clampedX = Math.max(chartMargin.left, Math.min(chartDimensions.width - chartMargin.right, x));
    const ratio = (clampedX - chartMargin.left) / usableWidth;
    const index = Math.round(ratio * (candles.length - 1));
    return Math.max(0, Math.min(candles.length - 1, index));
  };

  // Mouse Move Event Handler for Drawing Overlay
  const handleOverlayMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartWrapperRef.current) return;
    const rect = chartWrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const index = xToIndex(x);
    const price = yToPrice(y);
    const time = candles[index]?.time || '';

    setMousePos({ x, y, price, time, index });
  };

  const handleOverlayMouseLeave = () => {
    setMousePos(null);
  };

  // Click on chart overlay to place or start drawing
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mousePos) return;

    // 1. Placing a Custom Support Level
    if (activeTool === 'SUPPORT_LINE') {
      const newLevel: CustomLevel = {
        id: `level-supp-${Date.now()}`,
        type: 'SUPPORT',
        label: `دعم مخصص عند $${mousePos.price.toFixed(2)}`,
        price: mousePos.price,
        color: '#10b981',
        lineStyle: 'solid',
        createdAt: Date.now(),
      };
      saveDrawings(trendlines, [...customLevels, newLevel]);
      setActiveTool('CURSOR');
      return;
    }

    // 2. Placing a Custom Resistance Level
    if (activeTool === 'RESISTANCE_LINE') {
      const newLevel: CustomLevel = {
        id: `level-res-${Date.now()}`,
        type: 'RESISTANCE',
        label: `مقاومة مخصصة عند $${mousePos.price.toFixed(2)}`,
        price: mousePos.price,
        color: '#f43f5e',
        lineStyle: 'solid',
        createdAt: Date.now(),
      };
      saveDrawings(trendlines, [...customLevels, newLevel]);
      setActiveTool('CURSOR');
      return;
    }

    // 3. Drawing Trendline (2-Point Click)
    if (activeTool === 'TRENDLINE') {
      if (!pendingTrendStart) {
        // First Point Click
        setPendingTrendStart({
          index: mousePos.index,
          time: mousePos.time,
          price: mousePos.price,
          x: mousePos.x,
          y: mousePos.y,
        });
      } else {
        // Second Point Click -> Finalize Trendline
        const isUp = mousePos.price >= pendingTrendStart.price;
        const newTrendline: ChartTrendline = {
          id: `trend-${Date.now()}`,
          name: isUp ? 'خط اتجاه صاعد' : 'خط اتجاه هابط',
          startIndex: pendingTrendStart.index,
          startTime: pendingTrendStart.time,
          startPrice: pendingTrendStart.price,
          endIndex: mousePos.index,
          endTime: mousePos.time,
          endPrice: mousePos.price,
          color: isUp ? '#10b981' : '#f43f5e',
          lineStyle: 'solid',
          lineWidth: 2,
          createdAt: Date.now(),
        };
        saveDrawings([...trendlines, newTrendline], customLevels);
        setPendingTrendStart(null);
        setActiveTool('CURSOR');
      }
      return;
    }

    // 4. Measure Tool (2-Point Measurement)
    if (activeTool === 'MEASURE') {
      if (!pendingTrendStart) {
        setPendingTrendStart({
          index: mousePos.index,
          time: mousePos.time,
          price: mousePos.price,
          x: mousePos.x,
          y: mousePos.y,
        });
      } else {
        const diffPrice = mousePos.price - pendingTrendStart.price;
        const diffPercent = (diffPrice / pendingTrendStart.price) * 100;
        const diffPips = diffPrice * 10;
        const barsCount = Math.abs(mousePos.index - pendingTrendStart.index);

        setMeasurement({
          id: `measure-${Date.now()}`,
          startIndex: pendingTrendStart.index,
          startTime: pendingTrendStart.time,
          startPrice: pendingTrendStart.price,
          endIndex: mousePos.index,
          endTime: mousePos.time,
          endPrice: mousePos.price,
          diffPrice,
          diffPercent,
          diffPips,
          barsCount,
        });
        setPendingTrendStart(null);
        setActiveTool('CURSOR');
      }
      return;
    }
  };

  // Add Manual Custom Level from Dialog
  const handleAddManualLevel = () => {
    const priceNum = parseFloat(manualPriceInput);
    if (isNaN(priceNum) || priceNum <= 0) return;

    const newLevel: CustomLevel = {
      id: `custom-level-${Date.now()}`,
      type: manualLevelType,
      label: manualLabelInput.trim() || `${manualLevelType === 'SUPPORT' ? 'دعم' : 'مقاومة'} عند $${priceNum.toFixed(2)}`,
      price: Number(priceNum.toFixed(2)),
      color: manualColor,
      lineStyle: 'solid',
      createdAt: Date.now(),
    };

    saveDrawings(trendlines, [...customLevels, newLevel]);
    setShowAddLevelModal(false);
    setManualPriceInput('');
  };

  // Delete Handlers
  const handleDeleteTrendline = (id: string) => {
    saveDrawings(
      trendlines.filter(t => t.id !== id),
      customLevels
    );
    if (selectedDrawingId === id) setSelectedDrawingId(null);
  };

  const handleDeleteCustomLevel = (id: string) => {
    saveDrawings(
      trendlines,
      customLevels.filter(l => l.id !== id)
    );
    if (selectedDrawingId === id) setSelectedDrawingId(null);
  };

  const handleClearAllDrawings = () => {
    if (window.confirm('هل تريد مسح جميع خطوط الاتجاه ومستويات الدعم والمقاومة المخصصة؟')) {
      saveDrawings([], []);
      setMeasurement(null);
      setPendingTrendStart(null);
      setSelectedDrawingId(null);
    }
  };

  // Custom Candlestick Shape for Recharts
  const CustomCandleBar = (props: any) => {
    const { x, y, width, height, payload } = props;
    if (!payload) return null;

    const candle = payload as OHLCVCandle;
    const isBullish = candle.close >= candle.open;
    const candleColor = isBullish ? '#10b981' : '#f43f5e';

    const yHigh = priceToY(candle.high);
    const yLow = priceToY(candle.low);
    const yOpen = priceToY(candle.open);
    const yClose = priceToY(candle.close);

    const candleTop = Math.min(yOpen, yClose);
    const candleHeight = Math.max(2, Math.abs(yClose - yOpen));
    const candleWidth = Math.max(3, Math.min(10, width * 0.7));
    const candleX = x + (width - candleWidth) / 2;
    const wickX = x + width / 2;

    return (
      <g className="transition-opacity hover:opacity-80">
        {/* Upper and Lower Wick */}
        <line x1={wickX} y1={yHigh} x2={wickX} y2={yLow} stroke={candleColor} strokeWidth={1.2} />
        {/* Candle Body */}
        <rect
          x={candleX}
          y={candleTop}
          width={candleWidth}
          height={candleHeight}
          fill={candleColor}
          stroke={candleColor}
          strokeWidth={0.5}
          rx={1}
        />
      </g>
    );
  };

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as OHLCVCandle;
      const isGreen = data.close >= data.open;
      return (
        <div className="bg-slate-950/95 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs font-mono text-right z-50 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="text-amber-400 font-bold">{data.time}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isGreen ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
              {isGreen ? 'شمعة صاعدة ↗' : 'شمعة هابطة ↘'}
            </span>
          </div>
          <div className="space-y-1 text-slate-200">
            <p className="flex justify-between gap-4">
              <span className="text-slate-400 font-sans">الإغلاق:</span>
              <strong className="text-white">${data.close.toFixed(2)}</strong>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-400 font-sans">الافتتاح:</span>
              <span>${data.open.toFixed(2)}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-400 font-sans">أعلى سعر:</span>
              <span className="text-emerald-400 font-bold">${data.high.toFixed(2)}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-400 font-sans">أدنى سعر:</span>
              <span className="text-rose-400 font-bold">${data.low.toFixed(2)}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-400 font-sans">حجم التداول:</span>
              <span className="text-sky-400">{data.volume}</span>
            </p>
            {data.rsi && (
              <p className="flex justify-between gap-4 border-t border-slate-800/80 pt-1">
                <span className="text-purple-400 font-sans">مؤشر RSI:</span>
                <span className="text-purple-300 font-bold">{data.rsi}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const totalDrawingsCount = trendlines.length + customLevels.length;

  return (
    <div
      id="main-price-chart-container"
      className={`bg-slate-900/95 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl flex flex-col justify-between transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 bg-slate-950 overflow-y-auto' : ''
      }`}
    >
      {/* Top Header & Interactive Tools Bar */}
      <div className="flex flex-col gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Title & Asset */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <BarChart2 className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  الرسم البياني التفاعلي المتطور
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full font-sans">
                    رسم يدوي وتفاعلي
                  </span>
                </h2>
                <span className="text-xs text-slate-400 font-mono">XAU/USD Spot Gold</span>
              </div>
            </div>
          </div>

          {/* Timeframe Selector Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {timeframes.map(item => (
              <button
                key={item.tf}
                id={`tf-btn-${item.tf}`}
                onClick={() => onSelectTimeframe(item.tf)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedTimeframe === item.tf
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Chart View & Fullscreen */}
          <div className="flex items-center gap-1.5">
            {/* Toggle Candles vs Area */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setChartType('candles')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  chartType === 'candles' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                شموع يابانية
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  chartType === 'area' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                مساحي خطي
              </button>
            </div>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
              title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Interactive Drawing Tools Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/40">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-bold ml-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              أدوات الرسم:
            </span>

            {/* 1. Cursor / Normal Move */}
            <button
              onClick={() => {
                setActiveTool('CURSOR');
                setPendingTrendStart(null);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activeTool === 'CURSOR'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Move className="w-3.5 h-3.5" />
              <span>مؤشر عادي</span>
            </button>

            {/* 2. Manual Trendline Tool */}
            <button
              onClick={() => {
                setActiveTool('TRENDLINE');
                setPendingTrendStart(null);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activeTool === 'TRENDLINE'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>رسم خط اتجاه (Trendline)</span>
            </button>

            {/* 3. Add Custom Support Level */}
            <button
              onClick={() => {
                setActiveTool('SUPPORT_LINE');
                setPendingTrendStart(null);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activeTool === 'SUPPORT_LINE'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-sm'
                  : 'bg-slate-950 text-emerald-400 border-emerald-500/30 hover:bg-emerald-950/40'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>+ تحديد دعم مخصص</span>
            </button>

            {/* 4. Add Custom Resistance Level */}
            <button
              onClick={() => {
                setActiveTool('RESISTANCE_LINE');
                setPendingTrendStart(null);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activeTool === 'RESISTANCE_LINE'
                  ? 'bg-rose-500 text-white border-rose-400 font-bold shadow-sm'
                  : 'bg-slate-950 text-rose-400 border-rose-500/30 hover:bg-rose-950/40'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span>+ تحديد مقاومة مخصصة</span>
            </button>

            {/* 5. Ruler / Measure Tool */}
            <button
              onClick={() => {
                setActiveTool('MEASURE');
                setPendingTrendStart(null);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activeTool === 'MEASURE'
                  ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold shadow-sm'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>قياس النقاط والنسبة</span>
            </button>

            {/* 6. Add Level with Numeric Price Modal */}
            <button
              onClick={() => {
                setManualPriceInput(candles[candles.length - 1]?.close?.toFixed(2) || '2650.00');
                setShowAddLevelModal(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950 text-amber-300 border border-amber-500/30 hover:bg-amber-950/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>كتابة مستوى بالرقم</span>
            </button>
          </div>

          {/* Active Drawings Manager / Clear */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDrawingsList(!showDrawingsList)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                showDrawingsList
                  ? 'bg-slate-800 text-white border-slate-700'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>الرسومات الحالية ({totalDrawingsCount})</span>
            </button>

            {totalDrawingsCount > 0 && (
              <button
                onClick={handleClearAllDrawings}
                className="p-1 px-2 text-xs bg-red-950/40 text-rose-400 border border-red-500/30 hover:bg-red-900/60 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                title="مسح كل الخطوط والمستويات المخصصة"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">مسح الكل</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Tool Help Banner */}
        {activeTool !== 'CURSOR' && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2 px-3 flex items-center justify-between text-xs text-amber-300 animate-fadeIn">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {activeTool === 'TRENDLINE' &&
                  (!pendingTrendStart
                    ? 'انقر على الشمعة الأولى لبدء رسم خط الاتجاه (Trendline).'
                    : 'انقر على الشمعة الثانية لتثبيت خط الاتجاه وتحديد زاوية الصعود/الهبوط.')}
                {activeTool === 'SUPPORT_LINE' && 'انقر في أي مكان على الرسم البياني لتثبيت خط دعم مخصص.'}
                {activeTool === 'RESISTANCE_LINE' && 'انقر في أي مكان على الرسم البياني لتثبيت خط مقاومة مخصصة.'}
                {activeTool === 'MEASURE' &&
                  (!pendingTrendStart
                    ? 'انقر على النقطة الأولى لبدء قياس المسافة والنقاط.'
                    : 'انقر على النقطة الثانية لمعاينة فرق السعر، النسبة المئوية، وعدد النقاط (Pips).')}
              </span>
            </div>
            <button
              onClick={() => {
                setActiveTool('CURSOR');
                setPendingTrendStart(null);
              }}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 bg-slate-950 rounded border border-slate-800 cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        )}
      </div>

      {/* Main Interactive Chart Box with SVG Overlay */}
      <div
        ref={chartWrapperRef}
        id="interactive-chart-viewport"
        className="relative w-full h-84 sm:h-100 mt-3 select-none"
        onMouseMove={handleOverlayMouseMove}
        onMouseLeave={handleOverlayMouseLeave}
        onClick={handleOverlayClick}
        style={{ cursor: activeTool !== 'CURSOR' ? 'crosshair' : 'default' }}
      >
        {/* Recharts Base Layer */}
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={candles} margin={chartMargin}>
            <defs>
              <linearGradient id="goldAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} />
            <YAxis
              domain={[minPrice, maxPrice]}
              orientation="right"
              stroke="#64748b"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickFormatter={(v: number) => `$${v.toFixed(0)}`}
              tickLine={false}
            />
            {activeTool === 'CURSOR' && <Tooltip content={<CustomTooltip />} />}

            {/* Auto System Support / Resistance Reference Lines */}
            <ReferenceLine
              y={supportResistance.nearestResistance}
              stroke="#f43f5e"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `مقاومة نظام $${supportResistance.nearestResistance}`,
                fill: '#f43f5e',
                fontSize: 10,
                position: 'insideTopLeft',
              }}
            />
            <ReferenceLine
              y={supportResistance.nearestSupport}
              stroke="#10b981"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `دعم نظام $${supportResistance.nearestSupport}`,
                fill: '#10b981',
                fontSize: 10,
                position: 'insideBottomLeft',
              }}
            />

            {/* User Added Custom Horizontal S/R Levels */}
            {customLevels.map(level => (
              <ReferenceLine
                key={level.id}
                y={level.price}
                stroke={level.color}
                strokeDasharray={level.lineStyle === 'dashed' ? '5 5' : '0'}
                strokeWidth={2}
                label={{
                  value: `${level.label} ($${level.price})`,
                  fill: level.color,
                  fontSize: 11,
                  fontWeight: 'bold',
                  position: 'insideTopLeft',
                }}
              />
            ))}

            {/* Render Candlesticks OR Area */}
            {chartType === 'candles' ? (
              <Bar dataKey="close" shape={<CustomCandleBar />} />
            ) : (
              <Area type="monotone" dataKey="close" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#goldAreaGradient)" />
            )}

            {/* Moving Averages */}
            {showEMA20 && <Line type="monotone" dataKey="ema20" stroke="#fbbf24" strokeWidth={1.5} dot={false} name="EMA 20" />}
            {showEMA50 && <Line type="monotone" dataKey="ema50" stroke="#38bdf8" strokeWidth={1.5} dot={false} name="EMA 50" />}
            {showEMA200 && <Line type="monotone" dataKey="ema200" stroke="#34d399" strokeWidth={1.8} dot={false} name="EMA 200" />}

            {/* Bollinger Bands */}
            {showBollinger && <Line type="monotone" dataKey="upperBB" stroke="#a78bfa" strokeDasharray="3 3" strokeWidth={1} dot={false} />}
            {showBollinger && <Line type="monotone" dataKey="lowerBB" stroke="#a78bfa" strokeDasharray="3 3" strokeWidth={1} dot={false} />}
          </ComposedChart>
        </ResponsiveContainer>

        {/* SVG Drawing Overlay for Manual Trendlines & Dynamic Guides */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ width: chartDimensions.width, height: chartDimensions.height }}
        >
          {/* 1. Saved Trendlines */}
          {trendlines.map(trend => {
            const x1 = indexToX(trend.startIndex);
            const y1 = priceToY(trend.startPrice);
            const x2 = indexToX(trend.endIndex);
            const y2 = priceToY(trend.endPrice);
            const isSelected = selectedDrawingId === trend.id;

            return (
              <g key={trend.id} className="pointer-events-auto cursor-pointer" onClick={() => setSelectedDrawingId(trend.id)}>
                {/* Visible Trendline */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={trend.color}
                  strokeWidth={isSelected ? 3 : trend.lineWidth}
                  strokeDasharray={trend.lineStyle === 'dashed' ? '5 5' : '0'}
                />

                {/* Start & End Handles */}
                <circle cx={x1} cy={y1} r={isSelected ? 5 : 3.5} fill={trend.color} stroke="#0f172a" strokeWidth={1.5} />
                <circle cx={x2} cy={y2} r={isSelected ? 5 : 3.5} fill={trend.color} stroke="#0f172a" strokeWidth={1.5} />

                {/* Floating Label along the Trendline */}
                <rect
                  x={(x1 + x2) / 2 - 40}
                  y={(y1 + y2) / 2 - 18}
                  width={80}
                  height={16}
                  rx={4}
                  fill="#020617"
                  fillOpacity={0.9}
                  stroke={trend.color}
                  strokeWidth={0.8}
                />
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 6}
                  fill="#ffffff"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {trend.name}
                </text>
              </g>
            );
          })}

          {/* 2. In-Progress Rubberband Trendline Guide */}
          {pendingTrendStart && mousePos && (activeTool === 'TRENDLINE' || activeTool === 'MEASURE') && (
            <g>
              <line
                x1={pendingTrendStart.x}
                y1={pendingTrendStart.y}
                x2={mousePos.x}
                y2={mousePos.y}
                stroke={activeTool === 'MEASURE' ? '#38bdf8' : '#fbbf24'}
                strokeWidth={2}
                strokeDasharray="4 4"
              />
              <circle cx={pendingTrendStart.x} cy={pendingTrendStart.y} r={4} fill="#fbbf24" />
              <circle cx={mousePos.x} cy={mousePos.y} r={4} fill="#fbbf24" />

              {/* Dynamic Measurement Badge */}
              {activeTool === 'MEASURE' && (
                <g>
                  <rect
                    x={(pendingTrendStart.x + mousePos.x) / 2 - 65}
                    y={(pendingTrendStart.y + mousePos.y) / 2 - 28}
                    width={130}
                    height={26}
                    rx={6}
                    fill="#030712"
                    stroke="#38bdf8"
                    strokeWidth={1}
                  />
                  <text
                    x={(pendingTrendStart.x + mousePos.x) / 2}
                    y={(pendingTrendStart.y + mousePos.y) / 2 - 11}
                    fill="#38bdf8"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    ${(mousePos.price - pendingTrendStart.price).toFixed(2)} (
                    {(((mousePos.price - pendingTrendStart.price) / pendingTrendStart.price) * 100).toFixed(2)}%)
                  </text>
                </g>
              )}
            </g>
          )}

          {/* 3. Dynamic Crosshair & Price Badge when Hovering with Support/Resistance Tool */}
          {mousePos && (activeTool === 'SUPPORT_LINE' || activeTool === 'RESISTANCE_LINE') && (
            <g>
              <line
                x1={chartMargin.left}
                y1={mousePos.y}
                x2={chartDimensions.width - chartMargin.right}
                y2={mousePos.y}
                stroke={activeTool === 'SUPPORT_LINE' ? '#10b981' : '#f43f5e'}
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
              <rect
                x={chartDimensions.width - chartMargin.right}
                y={mousePos.y - 10}
                width={56}
                height={20}
                rx={4}
                fill={activeTool === 'SUPPORT_LINE' ? '#10b981' : '#f43f5e'}
              />
              <text
                x={chartDimensions.width - chartMargin.right + 28}
                y={mousePos.y + 4}
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
                textAnchor="middle"
              >
                ${mousePos.price.toFixed(2)}
              </text>
            </g>
          )}
        </svg>

        {/* Floating Measurement Result Box if active */}
        {measurement && (
          <div className="absolute bottom-4 left-4 bg-slate-950/95 border border-sky-500/50 rounded-xl p-3 shadow-2xl text-xs font-mono text-white backdrop-blur-md flex items-center gap-3 animate-fadeIn">
            <div className="p-2 bg-sky-500/20 rounded-lg text-sky-400">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-sans">نتيجة قياس المسافة:</div>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${measurement.diffPrice >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {measurement.diffPrice >= 0 ? '+' : ''}${measurement.diffPrice.toFixed(2)}
                </span>
                <span className="text-slate-400">({measurement.diffPercent.toFixed(2)}%)</span>
                <span className="text-sky-400 font-bold">| {Math.abs(measurement.diffPips).toFixed(0)} نقطة (Pip)</span>
              </div>
            </div>
            <button
              onClick={() => setMeasurement(null)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* RSI Sub-pane if toggled */}
      {showRSI && (
        <div className="h-24 w-full mt-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] text-purple-400 font-mono mb-1">
            <span>مؤشر القوة النسبية RSI (14)</span>
            <span>70: تشبع شرائي | 30: تشبع بيعي</span>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart data={candles} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" />
              <YAxis domain={[0, 100]} orientation="right" stroke="#64748b" tick={{ fontSize: 9 }} ticks={[30, 50, 70]} />
              <ReferenceLine y={70} stroke="#f43f5e" strokeDasharray="2 2" />
              <ReferenceLine y={30} stroke="#10b981" strokeDasharray="2 2" />
              <Line type="monotone" dataKey="rsi" stroke="#c084fc" strokeWidth={1.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Active Drawings Drawer List (Collapsible) */}
      {showDrawingsList && (
        <div className="mt-3 bg-slate-950/80 rounded-xl border border-slate-800 p-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              قائمة الخطوط والمستويات المخصصة على الشاشة
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">الإجمالي: {totalDrawingsCount}</span>
          </div>

          {totalDrawingsCount === 0 ? (
            <p className="text-xs text-slate-500 text-center py-2">لا توجد رسومات أو خطوط مخصصة حالياً. استخدم أدوات الرسم بالأعلى لإضافة خطوطك.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {/* Custom S/R Levels */}
              {customLevels.map(lvl => (
                <div
                  key={lvl.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-lg p-2 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lvl.color }}></span>
                    <div className="truncate">
                      <strong className="text-white block truncate">{lvl.label}</strong>
                      <span className="text-[11px] text-slate-400 font-mono">${lvl.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCustomLevel(lvl.id)}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-all cursor-pointer"
                    title="حذف هذا المستوى"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Trendlines */}
              {trendlines.map(t => (
                <div
                  key={t.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-lg p-2 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0" style={{ color: t.color }} />
                    <div className="truncate">
                      <strong className="text-white block truncate">{t.name}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ${t.startPrice.toFixed(1)} ➔ ${t.endPrice.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTrendline(t.id)}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-all cursor-pointer"
                    title="حذف خط الاتجاه"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chart Indicator Toggles & Footer Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 border-t border-slate-800/60 text-xs">
        {/* Indicators Pill Toggles */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-sans text-[11px]">المؤشرات المساعدة:</span>
          <button
            onClick={() => setShowEMA20(!showEMA20)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all cursor-pointer ${
              showEMA20 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            EMA 20
          </button>
          <button
            onClick={() => setShowEMA50(!showEMA50)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all cursor-pointer ${
              showEMA50 ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            EMA 50
          </button>
          <button
            onClick={() => setShowEMA200(!showEMA200)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all cursor-pointer ${
              showEMA200 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            EMA 200
          </button>
          <button
            onClick={() => setShowBollinger(!showBollinger)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all cursor-pointer ${
              showBollinger ? 'bg-violet-500/20 text-violet-300 border-violet-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            BB (20,2)
          </button>
          <button
            onClick={() => setShowRSI(!showRSI)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all cursor-pointer ${
              showRSI ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            RSI 14
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-rose-500"></span>
            مقاومة النظام ({supportResistance.nearestResistance})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-emerald-500"></span>
            دعم النظام ({supportResistance.nearestSupport})
          </span>
        </div>
      </div>

      {/* Modal: Add Manual Custom Level with Price Input */}
      {showAddLevelModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-400" />
                إضافة مستوى دعم أو مقاومة مخصص
              </h3>
              <button onClick={() => setShowAddLevelModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">السعر الدقيق (بالدولار):</label>
                <input
                  type="number"
                  step="0.1"
                  value={manualPriceInput}
                  onChange={e => setManualPriceInput(e.target.value)}
                  placeholder="مثال: 2642.50"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">نوع المستوى:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setManualLevelType('SUPPORT');
                      setManualLabelInput('دعم مخصص');
                      setManualColor('#10b981');
                    }}
                    className={`py-1.5 rounded-lg border text-center font-bold cursor-pointer ${
                      manualLevelType === 'SUPPORT' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    مستوى دعم
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setManualLevelType('RESISTANCE');
                      setManualLabelInput('مقاومة مخصصة');
                      setManualColor('#f43f5e');
                    }}
                    className={`py-1.5 rounded-lg border text-center font-bold cursor-pointer ${
                      manualLevelType === 'RESISTANCE' ? 'bg-rose-500/20 text-rose-300 border-rose-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    مستوى مقاومة
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setManualLevelType('KEY_LEVEL');
                      setManualLabelInput('هدف / محطة مهمة');
                      setManualColor('#fbbf24');
                    }}
                    className={`py-1.5 rounded-lg border text-center font-bold cursor-pointer ${
                      manualLevelType === 'KEY_LEVEL' ? 'bg-amber-500/20 text-amber-300 border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    مستوى محوري
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">اسم أو وصف المستوى:</label>
                <input
                  type="text"
                  value={manualLabelInput}
                  onChange={e => setManualLabelInput(e.target.value)}
                  placeholder="مثال: دعم القاع اليومي"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">لون الخط على الرسم:</label>
                <div className="flex items-center gap-2">
                  {colorOptions.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setManualColor(c.value)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                        manualColor === c.value ? 'scale-125 border-white shadow-md' : 'border-transparent opacity-70'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAddLevelModal(false)}
                className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-950 border border-slate-800 cursor-pointer text-xs"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddManualLevel}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer text-xs flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>إضافة وتثبيت المستوى</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
