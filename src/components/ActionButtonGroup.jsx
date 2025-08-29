// ActionButtonGroup.jsx
import React from 'react';
import { Save, Trash2 } from 'lucide-react';

const ActionButtonGroup = ({
  isProcessing,
  onProcess,
  onSave,
  onDelete,
  isDeleting,
  canSave,
  canDelete
}) => {
  return (
    <div className="mt-6 space-y-3">
      <button
        onClick={onProcess}
        disabled={isProcessing}
        className={`w-full py-2 rounded-lg font-medium transition-colors ${isProcessing ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
      >
        {isProcessing ? '处理中...' : '开始处理'}
      </button>
      <button
        onClick={onSave}
        disabled={!canSave}
        className={`w-full py-2 rounded-lg font-medium transition-colors ${!canSave ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
      >
        <Save className="w-4 h-4 inline mr-2" />
        保存到服务器
      </button>
      <button
        onClick={onDelete}
        disabled={isDeleting || !canDelete}
        className={`w-full py-2 rounded-lg font-medium transition-colors ${isDeleting || !canDelete ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
      >
        <Trash2 className="w-4 h-4 inline mr-2" />
        {isDeleting ? '删除中...' : '从服务器删除'}
      </button>
    </div>
  );
};

export default ActionButtonGroup;