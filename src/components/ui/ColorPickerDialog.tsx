import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HexColorPicker } from 'react-colorful';
import { clsx } from 'clsx';

interface ColorPickerDialogProps {
    isOpen: boolean;
    initialColor: string;
    onConfirm: (color: string) => void;
    onClose: () => void;
}

const ColorPickerDialog: React.FC<ColorPickerDialogProps> = ({ isOpen, initialColor, onConfirm, onClose }) => {
    const [color, setColor] = useState(initialColor);

    // Reset color when dialog opens
    useEffect(() => {
        if (isOpen) setColor(initialColor);
    }, [isOpen, initialColor]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-[#1e1e2e] border border-white/10 rounded-2xl p-5 shadow-2xl max-w-sm w-full animate-in fade-in scale-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-center text-white mb-2">Pick a color</h3>
                <HexColorPicker color={color} onChange={setColor} />
                <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md border border-white/10" style={{ backgroundColor: color }} />
                        <span className="text-xs font-mono text-muted uppercase tracking-wider">{color}</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className={clsx(
                                "px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white"
                            )}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className={clsx(
                                "px-3 py-1 rounded bg-primary hover:bg-primary/80 text-white"
                            )}
                            onClick={() => onConfirm(color)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ColorPickerDialog;
