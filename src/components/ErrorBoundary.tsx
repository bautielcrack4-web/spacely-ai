"use client";

import React, { ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                    <p className="text-gray-500 mb-8 max-w-md">
                        An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Refresh Page
                    </Button>
                    {process.env.NODE_SETTING === "development" && (
                        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left overflow-auto max-w-full">
                            <p className="text-xs font-mono text-red-600 whitespace-pre-wrap">
                                {this.state.error?.stack}
                            </p>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
