import React from 'react';

type Props = { children: React.ReactNode; fallback?: React.ReactNode };

type State = { hasError: boolean; error?: any };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-700 mb-2">Đã xảy ra lỗi khi hiển thị trang</h2>
              <p className="text-red-600 mb-3">Vui lòng tải lại trang hoặc báo cho quản trị viên.</p>
              <pre className="text-xs text-red-800 overflow-auto bg-white p-3 rounded border border-red-200">
                {String(this.state.error)}
              </pre>
              <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Tải lại</button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
