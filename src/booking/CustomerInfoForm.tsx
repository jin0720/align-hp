/**
 * CustomerInfoForm.tsx - 顧客情報入力（スクリーンショット 2315 ベース）
 */

import React, { useState } from 'react';
import type { BookingSession } from './types';
import classnames from 'classnames';

interface CustomerInfoFormProps {
  booking: BookingSession;
  userProfile: { userId: string; name: string } | null;
  onNameChange: (name: string) => void;
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
}

export const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  booking: _booking,
  userProfile,
  onNameChange,
  onNext,
  onBack,
  loading,
}) => {
  const [formData, setFormData] = useState({
    firstName: userProfile?.name.split(' ')[0] || '',
    lastName: userProfile?.name.split(' ')[1] || '',
    phone: '',
    email: '',
    birthDate: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // 名前フィールド更新
    if (name === 'firstName' || name === 'lastName') {
      const fullName = `${name === 'firstName' ? value : formData.firstName} ${name === 'lastName' ? value : formData.lastName}`.trim();
      onNameChange(fullName);
    }
  };

  const fullName = `${formData.firstName} ${formData.lastName}`.trim();
  const isValid = fullName.length > 0;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-pink-500 text-white px-4 py-3 flex items-center justify-between sticky top-0">
        <button onClick={onBack} className="text-xl">←</button>
        <h1 className="text-sm font-bold">お客様情報入力</h1>
        <div className="w-6" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <form className="space-y-4">
          {/* 名前 */}
          <div>
            <label className="block text-sm font-bold text-pink-600 mb-2">
              お名前 <span className="text-red-500">*必須</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="姓"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-pink-500"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="名"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* 電話番号 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              電話番号（ハイフン無し）
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="09012345678"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* メールアドレス */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* 生年月日 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              生年月日
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* 注意事項 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-gray-700 mt-6">
            <p className="mb-2">
              <strong>ご予約について：</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>予約時間の5分前までにご来店をお願いいたします</li>
              <li>その他ご要望がありましたらコメント欄よりお受けいたします</li>
              <li>こちらから頂いたコメントに対しての返信は行っておりませんのでご了承ください</li>
            </ul>
          </div>
        </form>
      </div>

      {/* Footer Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 max-w-full">
        <button
          onClick={onNext}
          disabled={!isValid || loading}
          className={classnames(
            'w-full py-3 rounded font-bold text-white transition',
            isValid && !loading
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-300 cursor-not-allowed'
          )}
        >
          {loading ? '入力中...' : '確認へ'}
        </button>
      </div>
    </div>
  );
};
