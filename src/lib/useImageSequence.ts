import { useState, useEffect } from 'react';

interface UseImageSequenceProps {
    totalFrames: number;
    basePath: string;
    fileNamePattern: (index: number) => string;
}

export function useImageSequence({ totalFrames, basePath, fileNamePattern }: UseImageSequenceProps) {
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            let loadedCount = 0;

            const promises = Array.from({ length: totalFrames }).map((_, i) => {
                return new Promise<void>((resolve, reject) => {
                    const img = new Image();
                    img.src = `${basePath}/${fileNamePattern(i)}`;

                    img.onload = () => {
                        loadedImages[i] = img;
                        loadedCount++;
                        if (isMounted) {
                            setProgress(Math.round((loadedCount / totalFrames) * 100));
                        }
                        resolve();
                    };

                    img.onerror = () => {
                        console.error(`Failed to load image index ${i}: ${img.src}`);
                        // We resolve anyway to not break the whole app, but might want to handle it
                        loadedImages[i] = img; // Placeholder or null
                        resolve();
                    };
                });
            });

            try {
                await Promise.all(promises);
                if (isMounted) {
                    setImages(loadedImages);
                    setLoaded(true);
                }
            } catch (err) {
                if (isMounted) setError("Failed to load image sequence");
            }
        };

        loadImages();

        return () => {
            isMounted = false;
        };
    }, [totalFrames, basePath, fileNamePattern]);

    /**
     * Retrieves the image for a given progress (0 to 1)
     */
    const getImageAt = (p: number) => {
        // Clamp progress
        const clamped = Math.max(0, Math.min(1, p));
        const index = Math.min(
            totalFrames - 1,
            Math.floor(clamped * (totalFrames - 1))
        );
        return images[index];
    };

    return {
        images, // All images if needed
        progress, // Loading progress 0-100
        loaded, // Is loading complete?
        getImageAt, // Function to get image at scroll progress
        error
    };
}
