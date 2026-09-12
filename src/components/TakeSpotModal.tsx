import React, { useState, useEffect, useRef } from 'react';
import { X, Zap, ShieldCheck, Car, Sparkles, Check, DollarSign, Upload, Image as ImageIcon, Trash2, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface NewSpotSubmission {
  collectorName: string;
  price: number;
  carName: string;
  rarity: string;
  year: string;
  shortDescription: string;
  imageUrl: string;
}

interface TakeSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSpotPrice: number;
  initialPrice?: number;
  onConfirmPutOnWall: (submission: NewSpotSubmission) => void;
}

const PRESET_CARS = [
  {
    id: 'gtr-r34',
    name: "Nissan Skyline GT-R (BNR34) Nismo",
    rarity: "Super Treasure Hunt ($TH)",
    year: "2002 / 2024",
    shortDescription: "Spectraflame Bayside Blue with Real Riders 6-spoke gold wheels and mirror chrome exhaust.",
    imageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1000&auto=format&fit=crop&q=85",
  },
  {
    id: 'porsche-gt3',
    name: "Porsche 911 GT3 RS Weissach Package",
    rarity: "Elite 64 Series",
    year: "2023 Edition",
    shortDescription: "Shark Blue with exposed carbon hood, Weissach aerodynamics, and magnesium racing rims.",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=85",
  },
  {
    id: 'datsun-240z',
    name: "1971 Datsun 240Z 'Chameleon' RLC",
    rarity: "RLC Exclusive",
    year: "1971 / 2025",
    shortDescription: "Spectraflame chameleon finish shifting from emerald green to royal violet on deep-dish Real Riders.",
    imageUrl: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=1000&auto=format&fit=crop&q=85",
  },
];

export const TakeSpotModal: React.FC<TakeSpotModalProps> = ({
  isOpen,
  onClose,
  currentSpotPrice,
  initialPrice,
  onConfirmPutOnWall,
}) => {
  const minRequiredPrice = Math.round((currentSpotPrice + 0.50) * 100) / 100;
  
  const [collectorName, setCollectorName] = useState('You');
  const [enteredPrice, setEnteredPrice] = useState<number>(initialPrice || minRequiredPrice);
  const [carName, setCarName] = useState('');
  const [rarity, setRarity] = useState('RLC Exclusive');
  const [shortDescription, setShortDescription] = useState('');
  
  // Image Upload state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>('gtr-r34');
  
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCollectorName('You');
      setEnteredPrice(initialPrice && initialPrice >= minRequiredPrice ? initialPrice : minRequiredPrice);
      setValidationError(null);
      setUploadedImage(null);
      setSelectedPresetId('gtr-r34');
      setCarName('Nissan Skyline GT-R (BNR34) Nismo');
      setShortDescription('Spectraflame Bayside Blue with Real Riders gold wheels.');
    }
  }, [isOpen, initialPrice, minRequiredPrice]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // File handling for Drag & Drop + Click
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setValidationError('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setValidationError('Image size must be under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      setSelectedPresetId(null);
      setValidationError(null);
      if (!carName) {
        setCarName(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handlePriceQuickIncrement = (add: number) => {
    const newPrice = Math.round((enteredPrice + add) * 100) / 100;
    setEnteredPrice(newPrice);
    if (newPrice >= minRequiredPrice) {
      setValidationError(null);
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_CARS[0]) => {
    setSelectedPresetId(preset.id);
    setUploadedImage(null);
    setCarName(preset.name);
    setRarity(preset.rarity);
    setShortDescription(preset.shortDescription);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (enteredPrice < minRequiredPrice) {
      setValidationError(`Price must be at least $${minRequiredPrice.toFixed(2)} to claim #1 on the Wall of Fame.`);
      return;
    }

    let finalImageUrl = uploadedImage;
    if (!finalImageUrl) {
      const preset = PRESET_CARS.find((p) => p.id === selectedPresetId) || PRESET_CARS[0];
      finalImageUrl = preset.imageUrl;
    }

    const finalCarName = carName.trim() || 'Custom Hot Wheels Diecast';
    const finalDesc = shortDescription.trim() || 'Mint diecast collector casting inducted onto the Wall of Fame.';

    onConfirmPutOnWall({
      collectorName: collectorName.trim() || 'You',
      price: enteredPrice,
      carName: finalCarName,
      rarity: rarity || 'Collector Exclusive',
      year: '2026 Edition',
      shortDescription: finalDesc,
      imageUrl: finalImageUrl,
    });
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg rounded-2xl bg-[#0f1117] border border-[#f59e0b]/40 p-5 sm:p-6 shadow-2xl shadow-black/90 overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle gold / bronze ambient glows */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#f59e0b]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#ff5500]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center pt-1 pb-3">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[#f59e0b]/15 border border-[#f59e0b]/40 text-[#f59e0b] mb-2 shadow-lg shadow-[#f59e0b]/15">
              <Sparkles className="w-5 h-5 fill-[#f59e0b]" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wide text-white">
              INDUCT ONTO THE WALL OF FAME
            </h2>
            <p className="text-xs text-neutral-400 font-medium">
              Upload your Hot Wheels and outbid current spot of ${currentSpotPrice.toFixed(2)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ================================================================= */}
            {/* 1. UPLOAD IMAGE OF YOUR HOT WHEEL (Drag & Drop + Click Selection) */}
            {/* ================================================================= */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#f59e0b] mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>Upload Your Hot Wheels Photo</span>
                </span>
                {uploadedImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedImage(null);
                      setSelectedPresetId('gtr-r34');
                    }}
                    className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </label>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {uploadedImage ? (
                /* Preview of Uploaded Hot Wheel */
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border-2 border-[#f59e0b] bg-black shadow-lg group">
                  <img
                    src={uploadedImage}
                    alt="Uploaded Hot Wheels"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#f59e0b] text-black font-bold text-xs flex items-center gap-1 shadow-md hover:bg-amber-400 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Change Photo</span>
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Your Photo Ready to Induct</span>
                  </div>
                </div>
              ) : (
                /* Drag & Drop Upload Zone */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#f59e0b] bg-[#f59e0b]/15 scale-[0.99]'
                      : 'border-white/20 hover:border-[#f59e0b]/60 bg-black/40 hover:bg-black/60'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-[#f59e0b] mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-white">
                    Drag & drop your Hot Wheels photo here, or <span className="text-[#f59e0b] underline">browse</span>
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Supports JPG, PNG, WEBP from your phone or files
                  </p>
                </div>
              )}

              {/* Or Quick Preset Option */}
              {!uploadedImage && (
                <div className="mt-2.5">
                  <span className="text-[11px] text-neutral-400 block mb-1">
                    Or select a classic collector showcase preset:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_CARS.map((car) => {
                      const isSelected = selectedPresetId === car.id;
                      return (
                        <button
                          type="button"
                          key={car.id}
                          onClick={() => handleSelectPreset(car)}
                          className={`p-1.5 rounded-lg border text-left transition-all relative overflow-hidden cursor-pointer ${
                            isSelected
                              ? 'bg-[#f59e0b]/15 border-[#f59e0b] ring-1 ring-[#f59e0b]'
                              : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-400'
                          }`}
                        >
                          <div className="aspect-video w-full rounded overflow-hidden mb-1 bg-black">
                            <img
                              src={car.imageUrl}
                              alt={car.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-[10px] font-bold text-white truncate leading-tight">
                            {car.name}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ================================================================= */}
            {/* 2. EDITABLE PRICE SECTION                                         */}
            {/* ================================================================= */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-[#f59e0b]/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="modal-price-input"
                  className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>Your Spot Price (Editable):</span>
                </label>
                <span className="text-[11px] font-mono text-neutral-400">
                  Min bid: ${minRequiredPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-black text-xl text-[#f59e0b]">
                    $
                  </span>
                  <input
                    id="modal-price-input"
                    type="number"
                    step="0.25"
                    min={minRequiredPrice}
                    value={enteredPrice}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) {
                        setEnteredPrice(val);
                        if (val >= minRequiredPrice) setValidationError(null);
                      }
                    }}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#161922] border border-white/20 text-white font-mono text-xl font-black focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] transition-all"
                  />
                </div>

                {/* Quick Add Chips */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handlePriceQuickIncrement(0.50)}
                    className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-xs font-mono font-bold transition-colors cursor-pointer"
                  >
                    +$0.50
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePriceQuickIncrement(1.00)}
                    className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-xs font-mono font-bold transition-colors cursor-pointer"
                  >
                    +$1.00
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePriceQuickIncrement(2.50)}
                    className="px-2.5 py-2 rounded-xl bg-[#f59e0b]/20 hover:bg-[#f59e0b]/30 border border-[#f59e0b]/40 text-[#f59e0b] text-xs font-mono font-bold transition-colors cursor-pointer"
                  >
                    +$2.50
                  </button>
                </div>
              </div>

              {validationError && (
                <p className="text-xs text-rose-400 font-semibold mt-1">
                  {validationError}
                </p>
              )}
            </div>

            {/* ================================================================= */}
            {/* 3. COLLECTOR & CAR DETAILS                                        */}
            {/* ================================================================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label 
                  htmlFor="modal-collector-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1"
                >
                  Collector Name
                </label>
                <input
                  id="modal-collector-input"
                  type="text"
                  maxLength={24}
                  value={collectorName}
                  onChange={(e) => setCollectorName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 rounded-xl bg-[#161922] border border-white/15 text-white font-semibold text-sm placeholder:text-neutral-600 focus:outline-none focus:border-[#f59e0b]"
                />
              </div>

              <div>
                <label 
                  htmlFor="modal-car-name-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1"
                >
                  Hot Wheels Model Name
                </label>
                <input
                  id="modal-car-name-input"
                  type="text"
                  maxLength={40}
                  value={carName}
                  onChange={(e) => setCarName(e.target.value)}
                  placeholder="e.g. 1970 Pontiac Firebird"
                  className="w-full px-3 py-2 rounded-xl bg-[#161922] border border-white/15 text-white font-semibold text-sm placeholder:text-neutral-600 focus:outline-none focus:border-[#f59e0b]"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="modal-desc-input"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1"
              >
                Short Description / Casting Notes
              </label>
              <input
                id="modal-desc-input"
                type="text"
                maxLength={90}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="e.g. Spectraflame finish, Real Riders tires, mint condition"
                className="w-full px-3 py-2 rounded-xl bg-[#161922] border border-white/15 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-[#f59e0b]"
              />
            </div>

            {/* ================================================================= */}
            {/* 4. “PUT ON THE WALL” BUTTON                                       */}
            {/* ================================================================= */}
            <button
              type="submit"
              id="modal-put-on-wall-button"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#ff6a00] to-[#ff2d55] hover:brightness-110 active:scale-[0.98] text-white font-display text-lg sm:text-xl font-bold tracking-wider uppercase shadow-xl shadow-[#f59e0b]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-white" />
              <span>Put on the Wall — ${enteredPrice.toFixed(2)}</span>
            </button>
          </form>

          {/* Micro Guarantee */}
          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Immediately immortalized as #1 on THE WALL OF FAME</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
