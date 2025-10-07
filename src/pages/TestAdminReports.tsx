import React, { useState, useEffect } from 'react';
import { 
  Users, Building2, GraduationCap, FileText,
  Download, Calendar, CheckCircle, Clock,
  AlertTriangle, BarChart3, TrendingUp, Filter
} from 'lucide-react';

interface ReportData {
  totalStudents: number;
  totalCompanies: number;
  totalTeachers: number;
  totalInternships: number;
  completedInternships: number;
  pendingReports: number;
  overdueReports: number;
}

const TestAdminReports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData>({
    totalStudents: 0,
    totalCompanies: 0,
    totalTeachers: 0,
    totalInternships: 0,
    completedInternships: 0,
    pendingReports: 0,
    overdueReports: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  useEffect(() => {
    // Simulate API call
    const fetchReportData = async () => {
      setLoading(true);
      // Mock data
      setTimeout(() => {
        setReportData({
          totalStudents: 150,
          totalCompanies: 45,
          totalTeachers: 25,
          totalInternships: 120,
          completedInternships: 95,
          pendingReports: 18,
          overdueReports: 7
        });
        setLoading(false);
      }, 1000);
    };

    fetchReportData();
  }, [selectedPeriod]);

  const handleExportReport = () => {
    // Export functionality
    console.log('Exporting report...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải báo cáo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Báo cáo Thống kê</h1>
              <p className="text-gray-600 mt-2">Tổng quan hệ thống thực tập sinh viên</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="current">Kỳ hiện tại</option>
                <option value="previous">Kỳ trước</option>
                <option value="year">Cả năm</option>
              </select>
              <button
                onClick={handleExportReport}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng sinh viên</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doanh nghiệp</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.totalCompanies}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Giảng viên</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.totalTeachers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Thực tập</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.totalInternships}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tiến độ thực tập</h3>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hoàn thành</span>
                  <span className="font-medium">{reportData.completedInternships}/{reportData.totalInternships}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(reportData.completedInternships / reportData.totalInternships) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Báo cáo chờ duyệt</h3>
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{reportData.pendingReports}</p>
              <p className="text-sm text-gray-600">báo cáo</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Báo cáo quá hạn</h3>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{reportData.overdueReports}</p>
              <p className="text-sm text-gray-600">báo cáo</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Biểu đồ thống kê</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Biểu đồ sẽ được hiển thị tại đây</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Xu hướng</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Biểu đồ xu hướng sẽ được hiển thị tại đây</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAdminReports;