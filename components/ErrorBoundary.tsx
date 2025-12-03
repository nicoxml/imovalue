import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo
        });

        // TODO: Send to error tracking service (Sentry, etc.)
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-brand-surface border border-red-500/20 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-2">
                            Algo correu mal
                        </h1>

                        <p className="text-gray-400 mb-6">
                            Ocorreu um erro inesperado. Por favor, tente recarregar a página.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-300 mb-2">
                                    Detalhes do erro (desenvolvimento)
                                </summary>
                                <div className="bg-black/50 rounded-lg p-4 text-xs text-red-400 overflow-auto max-h-40">
                                    <p className="font-bold mb-2">{this.state.error.toString()}</p>
                                    {this.state.errorInfo && (
                                        <pre className="whitespace-pre-wrap">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    )}
                                </div>
                            </details>
                        )}

                        <button
                            onClick={this.handleReset}
                            className="w-full bg-brand-blue hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                        >
                            Recarregar Página
                        </button>

                        <p className="text-xs text-gray-500 mt-4">
                            Se o problema persistir, contacte o suporte
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
