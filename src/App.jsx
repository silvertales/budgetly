import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// ── Language Dictionary (15 languages) ───────────────────────────────────────
const LANGUAGES = {
  en: {
    dir: 'ltr',
    welcome: 'Welcome back',
    balance: 'Net Balance',
    income: 'Total Income',
    expenses: 'Total Expenses',
    historyTitle: 'Recent Transactions',
    last5: 'Last 5 entries',
    budgetTitle: 'Category Limits',
    budgetSubtitle: 'Limits vs. actual spend',
    adjust: 'Edit',
    statsTitle: 'Analytics',
    statsSubtitle: 'Visual cashflow breakdown',
    saved: 'Net Savings',
    burn: 'Burn Rate',
    distribution: 'Expense Distribution',
    statsStatus: 'Active',
    pref: 'Preferences',
    currency: 'Currency',
    lang: 'Language',
    theme: 'Theme',
    dataExport: 'Data',
    exportPdf: 'Export PDF Report',
    resetData: 'Reset to Sample Data',
    logout: 'Sign Out',
    newTrans: 'New Transaction',
    enterAmt: 'Amount',
    txExpense: 'Expense',
    txIncome: 'Income',
    category: 'Category',
    note: 'Note',
    saveTrans: 'Add Transaction',
    adjustLimits: 'Set Budgets',
    saveLimits: 'Save Budgets',
    deleteConfirm: 'Delete this transaction?',
    navDashboard: 'Wallet',
    navBudget: 'Limits',
    navStats: 'Analytics',
    navAccount: 'Profile',
    loading: 'Loading…',
    noTransactions: 'No transactions yet.',
    categories: {
      groceries: 'Groceries',
      shopping: 'Shopping',
      entertainment: 'Entertainment',
      transport: 'Transport',
      housing: 'Housing',
      income: 'Income',
      other: 'Other',
    },
  },
  fa: {
    dir: 'rtl',
    welcome: 'خوش آمدید',
    balance: 'موجودی خالص',
    income: 'کل درآمد',
    expenses: 'کل هزینه',
    historyTitle: 'تراکنش‌های اخیر',
    last5: '۵ تراکنش اخیر',
    budgetTitle: 'محدودیت دسته‌ها',
    budgetSubtitle: 'مقایسه بودجه با هزینه واقعی',
    adjust: 'ویرایش',
    statsTitle: 'آمار و نمودار',
    statsSubtitle: 'تحلیل جریان نقدی شما',
    saved: 'پس‌انداز خالص',
    burn: 'نرخ مصرف',
    distribution: 'توزیع هزینه‌ها',
    statsStatus: 'فعال',
    pref: 'تنظیمات',
    currency: 'واحد پول',
    lang: 'زبان',
    theme: 'پوسته',
    dataExport: 'داده‌ها',
    exportPdf: 'خروجی PDF',
    resetData: 'بازنشانی به نمونه',
    logout: 'خروج',
    newTrans: 'تراکنش جدید',
    enterAmt: 'مبلغ',
    txExpense: 'هزینه',
    txIncome: 'درآمد',
    category: 'دسته‌بندی',
    note: 'توضیحات',
    saveTrans: 'ثبت تراکنش',
    adjustLimits: 'تنظیم بودجه',
    saveLimits: 'ذخیره بودجه',
    deleteConfirm: 'حذف این تراکنش؟',
    navDashboard: 'کیف پول',
    navBudget: 'بودجه',
    navStats: 'نمودار',
    navAccount: 'پروفایل',
    loading: 'در حال بارگذاری…',
    noTransactions: 'هنوز تراکنشی ندارید.',
    categories: {
      groceries: 'خرید روزانه',
      shopping: 'خرید شخصی',
      entertainment: 'تفریح',
      transport: 'رفت و آمد',
      housing: 'مسکن',
      income: 'درآمد',
      other: 'متفرقه',
    },
  },
  es: {
    dir: 'ltr', welcome: 'Bienvenido', balance: 'Saldo Neto', income: 'Ingresos', expenses: 'Gastos',
    historyTitle: 'Transacciones', last5: 'Últimas 5', budgetTitle: 'Presupuestos', budgetSubtitle: 'Límites vs. gasto real',
    adjust: 'Editar', statsTitle: 'Análisis', statsSubtitle: 'Desglose de flujo', saved: 'Ahorro Neto',
    burn: 'Tasa de Gasto', distribution: 'Distribución', statsStatus: 'Activo', pref: 'Preferencias',
    currency: 'Moneda', lang: 'Idioma', theme: 'Tema', dataExport: 'Datos', exportPdf: 'Exportar PDF',
    resetData: 'Restablecer datos', logout: 'Cerrar sesión', newTrans: 'Nueva Transacción', enterAmt: 'Monto',
    txExpense: 'Gasto', txIncome: 'Ingreso', category: 'Categoría', note: 'Nota', saveTrans: 'Agregar',
    adjustLimits: 'Definir límites', saveLimits: 'Guardar', deleteConfirm: '¿Eliminar esta transacción?',
    navDashboard: 'Cartera', navBudget: 'Límites', navStats: 'Análisis', navAccount: 'Perfil',
    loading: 'Cargando…', noTransactions: 'Sin transacciones.',
    categories: { groceries: 'Alimentos', shopping: 'Compras', entertainment: 'Entretenimiento', transport: 'Transporte', housing: 'Vivienda', income: 'Ingresos', other: 'Otros' },
  },
  fr: {
    dir: 'ltr', welcome: 'Bon retour', balance: 'Solde Net', income: 'Revenus', expenses: 'Dépenses',
    historyTitle: 'Transactions', last5: '5 dernières', budgetTitle: 'Budgets', budgetSubtitle: 'Limites vs. dépenses réelles',
    adjust: 'Modifier', statsTitle: 'Analyses', statsSubtitle: 'Flux de trésorerie', saved: 'Épargne Nette',
    burn: 'Taux de dépense', distribution: 'Répartition', statsStatus: 'Actif', pref: 'Préférences',
    currency: 'Devise', lang: 'Langue', theme: 'Thème', dataExport: 'Données', exportPdf: 'Exporter PDF',
    resetData: 'Réinitialiser', logout: 'Déconnexion', newTrans: 'Nouvelle transaction', enterAmt: 'Montant',
    txExpense: 'Dépense', txIncome: 'Revenu', category: 'Catégorie', note: 'Note', saveTrans: 'Ajouter',
    adjustLimits: 'Définir budgets', saveLimits: 'Enregistrer', deleteConfirm: 'Supprimer cette transaction ?',
    navDashboard: 'Portefeuille', navBudget: 'Limites', navStats: 'Analyses', navAccount: 'Profil',
    loading: 'Chargement…', noTransactions: 'Aucune transaction.',
    categories: { groceries: 'Alimentation', shopping: 'Shopping', entertainment: 'Loisirs', transport: 'Transport', housing: 'Logement', income: 'Revenus', other: 'Divers' },
  },
  de: {
    dir: 'ltr', welcome: 'Willkommen zurück', balance: 'Nettosaldo', income: 'Einnahmen', expenses: 'Ausgaben',
    historyTitle: 'Transaktionen', last5: 'Letzte 5', budgetTitle: 'Budgets', budgetSubtitle: 'Limit vs. Ausgaben',
    adjust: 'Bearbeiten', statsTitle: 'Analysen', statsSubtitle: 'Cashflow-Übersicht', saved: 'Ersparnisse',
    burn: 'Verbrauchsrate', distribution: 'Ausgabenverteilung', statsStatus: 'Aktiv', pref: 'Einstellungen',
    currency: 'Währung', lang: 'Sprache', theme: 'Design', dataExport: 'Daten', exportPdf: 'PDF exportieren',
    resetData: 'Zurücksetzen', logout: 'Abmelden', newTrans: 'Neue Transaktion', enterAmt: 'Betrag',
    txExpense: 'Ausgabe', txIncome: 'Einnahme', category: 'Kategorie', note: 'Notiz', saveTrans: 'Hinzufügen',
    adjustLimits: 'Budgets festlegen', saveLimits: 'Speichern', deleteConfirm: 'Transaktion löschen?',
    navDashboard: 'Brieftasche', navBudget: 'Budgets', navStats: 'Analysen', navAccount: 'Profil',
    loading: 'Lädt…', noTransactions: 'Keine Transaktionen.',
    categories: { groceries: 'Lebensmittel', shopping: 'Einkaufen', entertainment: 'Unterhaltung', transport: 'Transport', housing: 'Wohnen', income: 'Einnahmen', other: 'Sonstiges' },
  },
  it: {
    dir: 'ltr', welcome: 'Bentornato', balance: 'Saldo Netto', income: 'Entrate', expenses: 'Uscite',
    historyTitle: 'Transazioni', last5: 'Ultime 5', budgetTitle: 'Budget', budgetSubtitle: 'Limiti vs. spese reali',
    adjust: 'Modifica', statsTitle: 'Statistiche', statsSubtitle: 'Analisi del flusso', saved: 'Risparmio Netto',
    burn: 'Tasso di spesa', distribution: 'Distribuzione', statsStatus: 'Attivo', pref: 'Preferenze',
    currency: 'Valuta', lang: 'Lingua', theme: 'Tema', dataExport: 'Dati', exportPdf: 'Esporta PDF',
    resetData: 'Ripristina', logout: 'Esci', newTrans: 'Nuova Transazione', enterAmt: 'Importo',
    txExpense: 'Uscita', txIncome: 'Entrata', category: 'Categoria', note: 'Nota', saveTrans: 'Aggiungi',
    adjustLimits: 'Imposta budget', saveLimits: 'Salva', deleteConfirm: 'Eliminare questa transazione?',
    navDashboard: 'Wallet', navBudget: 'Limiti', navStats: 'Grafici', navAccount: 'Profilo',
    loading: 'Caricamento…', noTransactions: 'Nessuna transazione.',
    categories: { groceries: 'Spesa', shopping: 'Shopping', entertainment: 'Intrattenimento', transport: 'Trasporto', housing: 'Casa', income: 'Entrate', other: 'Altro' },
  },
  ar: {
    dir: 'rtl', welcome: 'مرحباً بك', balance: 'صافي الرصيد', income: 'الدخل', expenses: 'المصروفات',
    historyTitle: 'المعاملات', last5: 'آخر 5', budgetTitle: 'الميزانية', budgetSubtitle: 'الحدود مقابل الإنفاق',
    adjust: 'تعديل', statsTitle: 'الإحصائيات', statsSubtitle: 'تحليل التدفق النقدي', saved: 'صافي الادخار',
    burn: 'معدل الإنفاق', distribution: 'توزيع المصروفات', statsStatus: 'نشط', pref: 'التفضيلات',
    currency: 'العملة', lang: 'اللغة', theme: 'السمة', dataExport: 'البيانات', exportPdf: 'تصدير PDF',
    resetData: 'إعادة التعيين', logout: 'تسجيل الخروج', newTrans: 'معاملة جديدة', enterAmt: 'المبلغ',
    txExpense: 'مصروف', txIncome: 'دخل', category: 'الفئة', note: 'ملاحظة', saveTrans: 'إضافة',
    adjustLimits: 'تحديد الميزانية', saveLimits: 'حفظ', deleteConfirm: 'حذف هذه المعاملة؟',
    navDashboard: 'المحفظة', navBudget: 'الحدود', navStats: 'التحليلات', navAccount: 'الملف',
    loading: 'جار التحميل…', noTransactions: 'لا توجد معاملات.',
    categories: { groceries: 'البقالة', shopping: 'التسوق', entertainment: 'الترفيه', transport: 'المواصلات', housing: 'السكن', income: 'الدخل', other: 'أخرى' },
  },
  tr: {
    dir: 'ltr', welcome: 'Tekrar hoş geldin', balance: 'Net Bakiye', income: 'Gelirler', expenses: 'Giderler',
    historyTitle: 'İşlemler', last5: 'Son 5', budgetTitle: 'Limitler', budgetSubtitle: 'Limit vs. gerçek harcama',
    adjust: 'Düzenle', statsTitle: 'Analizler', statsSubtitle: 'Nakit akış özeti', saved: 'Net Tasarruf',
    burn: 'Tüketim Oranı', distribution: 'Gider Dağılımı', statsStatus: 'Aktif', pref: 'Tercihler',
    currency: 'Para Birimi', lang: 'Dil', theme: 'Tema', dataExport: 'Veriler', exportPdf: 'PDF İndir',
    resetData: 'Sıfırla', logout: 'Çıkış', newTrans: 'Yeni İşlem', enterAmt: 'Tutar',
    txExpense: 'Gider', txIncome: 'Gelir', category: 'Kategori', note: 'Not', saveTrans: 'Ekle',
    adjustLimits: 'Bütçe Belirle', saveLimits: 'Kaydet', deleteConfirm: 'Bu işlemi sil?',
    navDashboard: 'Cüzdan', navBudget: 'Limitler', navStats: 'Analizler', navAccount: 'Profil',
    loading: 'Yükleniyor…', noTransactions: 'Henüz işlem yok.',
    categories: { groceries: 'Market', shopping: 'Alışveriş', entertainment: 'Eğlence', transport: 'Ulaşım', housing: 'Konut', income: 'Gelir', other: 'Diğer' },
  },
  zh: {
    dir: 'ltr', welcome: '欢迎回来', balance: '净余额', income: '总收入', expenses: '总支出',
    historyTitle: '交易记录', last5: '最近5笔', budgetTitle: '预算限额', budgetSubtitle: '限额与实际支出对比',
    adjust: '编辑', statsTitle: '财务分析', statsSubtitle: '资金流向分布', saved: '净储蓄',
    burn: '支出率', distribution: '支出分布', statsStatus: '活跃', pref: '设置',
    currency: '货币', lang: '语言', theme: '主题', dataExport: '数据', exportPdf: '导出PDF',
    resetData: '重置数据', logout: '退出', newTrans: '新建记账', enterAmt: '金额',
    txExpense: '支出', txIncome: '收入', category: '分类', note: '备注', saveTrans: '添加',
    adjustLimits: '设置预算', saveLimits: '保存', deleteConfirm: '删除此交易？',
    navDashboard: '钱包', navBudget: '预算', navStats: '图表', navAccount: '设置',
    loading: '加载中…', noTransactions: '暂无交易记录。',
    categories: { groceries: '食品购物', shopping: '服饰购物', entertainment: '娱乐', transport: '交通', housing: '房租', income: '收入', other: '其他' },
  },
  ru: {
    dir: 'ltr', welcome: 'С возвращением', balance: 'Чистый баланс', income: 'Доходы', expenses: 'Расходы',
    historyTitle: 'Транзакции', last5: 'Последние 5', budgetTitle: 'Лимиты', budgetSubtitle: 'Лимит vs. расходы',
    adjust: 'Изменить', statsTitle: 'Аналитика', statsSubtitle: 'Анализ денежного потока', saved: 'Сбережения',
    burn: 'Интенсивность', distribution: 'Категории', statsStatus: 'Активен', pref: 'Настройки',
    currency: 'Валюта', lang: 'Язык', theme: 'Тема', dataExport: 'Данные', exportPdf: 'Экспорт PDF',
    resetData: 'Сбросить данные', logout: 'Выйти', newTrans: 'Новая транзакция', enterAmt: 'Сумма',
    txExpense: 'Расход', txIncome: 'Доход', category: 'Категория', note: 'Заметка', saveTrans: 'Добавить',
    adjustLimits: 'Установить лимиты', saveLimits: 'Сохранить', deleteConfirm: 'Удалить транзакцию?',
    navDashboard: 'Кошелёк', navBudget: 'Лимиты', navStats: 'Графики', navAccount: 'Профиль',
    loading: 'Загрузка…', noTransactions: 'Нет транзакций.',
    categories: { groceries: 'Продукты', shopping: 'Покупки', entertainment: 'Развлечения', transport: 'Транспорт', housing: 'Жильё', income: 'Доходы', other: 'Прочее' },
  },
  pt: {
    dir: 'ltr', welcome: 'Bem-vindo', balance: 'Saldo Líquido', income: 'Receitas', expenses: 'Despesas',
    historyTitle: 'Transações', last5: 'Últimas 5', budgetTitle: 'Orçamentos', budgetSubtitle: 'Limites vs. gastos reais',
    adjust: 'Editar', statsTitle: 'Análise', statsSubtitle: 'Fluxo de caixa', saved: 'Poupança Líquida',
    burn: 'Taxa de gasto', distribution: 'Distribuição', statsStatus: 'Ativo', pref: 'Preferências',
    currency: 'Moeda', lang: 'Idioma', theme: 'Tema', dataExport: 'Dados', exportPdf: 'Exportar PDF',
    resetData: 'Restaurar dados', logout: 'Sair', newTrans: 'Nova Transação', enterAmt: 'Valor',
    txExpense: 'Despesa', txIncome: 'Receita', category: 'Categoria', note: 'Nota', saveTrans: 'Adicionar',
    adjustLimits: 'Definir limites', saveLimits: 'Guardar', deleteConfirm: 'Eliminar esta transação?',
    navDashboard: 'Carteira', navBudget: 'Limites', navStats: 'Gráficos', navAccount: 'Perfil',
    loading: 'A carregar…', noTransactions: 'Sem transações.',
    categories: { groceries: 'Supermercado', shopping: 'Compras', entertainment: 'Entretenimento', transport: 'Transporte', housing: 'Habitação', income: 'Receitas', other: 'Outros' },
  },
  ja: {
    dir: 'ltr', welcome: 'おかえりなさい', balance: '純残高', income: '収入', expenses: '支出',
    historyTitle: '取引履歴', last5: '直近5件', budgetTitle: '予算', budgetSubtitle: '上限と実費の比較',
    adjust: '編集', statsTitle: '分析', statsSubtitle: 'キャッシュフロー分析', saved: '純貯蓄',
    burn: '消費率', distribution: '支出内訳', statsStatus: '稼働中', pref: '設定',
    currency: '通貨', lang: '言語', theme: 'テーマ', dataExport: 'データ', exportPdf: 'PDFで出力',
    resetData: 'リセット', logout: 'ログアウト', newTrans: '新規取引', enterAmt: '金額',
    txExpense: '支出', txIncome: '収入', category: 'カテゴリ', note: 'メモ', saveTrans: '追加',
    adjustLimits: '予算を設定', saveLimits: '保存', deleteConfirm: 'この取引を削除しますか？',
    navDashboard: '財布', navBudget: '予算', navStats: 'グラフ', navAccount: '設定',
    loading: '読み込み中…', noTransactions: '取引がありません。',
    categories: { groceries: '食品', shopping: 'ショッピング', entertainment: 'エンタメ', transport: '交通', housing: '住居', income: '収入', other: 'その他' },
  },
  ko: {
    dir: 'ltr', welcome: '다시 오셨군요', balance: '순 잔액', income: '총수입', expenses: '총지출',
    historyTitle: '거래 내역', last5: '최근 5건', budgetTitle: '예산 한도', budgetSubtitle: '한도 대비 지출',
    adjust: '편집', statsTitle: '분석', statsSubtitle: '현금 흐름 분석', saved: '순 저축',
    burn: '소비율', distribution: '지출 분포', statsStatus: '활성', pref: '환경설정',
    currency: '통화', lang: '언어', theme: '테마', dataExport: '데이터', exportPdf: 'PDF 내보내기',
    resetData: '초기화', logout: '로그아웃', newTrans: '새 거래', enterAmt: '금액',
    txExpense: '지출', txIncome: '수입', category: '카테고리', note: '메모', saveTrans: '추가',
    adjustLimits: '예산 설정', saveLimits: '저장', deleteConfirm: '이 거래를 삭제하시겠습니까?',
    navDashboard: '지갑', navBudget: '한도', navStats: '분석', navAccount: '프로필',
    loading: '로딩 중…', noTransactions: '거래 내역이 없습니다.',
    categories: { groceries: '식료품', shopping: '쇼핑', entertainment: '엔터테인먼트', transport: '교통', housing: '주거', income: '수입', other: '기타' },
  },
  nl: {
    dir: 'ltr', welcome: 'Welkom terug', balance: 'Netto Saldo', income: 'Inkomsten', expenses: 'Uitgaven',
    historyTitle: 'Transacties', last5: 'Laatste 5', budgetTitle: 'Budgetten', budgetSubtitle: 'Limieten vs. werkelijke uitgaven',
    adjust: 'Bewerken', statsTitle: 'Analyses', statsSubtitle: 'Cashflow-overzicht', saved: 'Netto Besparingen',
    burn: 'Verbranding', distribution: 'Verdeling', statsStatus: 'Actief', pref: 'Instellingen',
    currency: 'Valuta', lang: 'Taal', theme: 'Thema', dataExport: 'Gegevens', exportPdf: 'PDF exporteren',
    resetData: 'Resetten', logout: 'Uitloggen', newTrans: 'Nieuwe Transactie', enterAmt: 'Bedrag',
    txExpense: 'Uitgave', txIncome: 'Inkomst', category: 'Categorie', note: 'Notitie', saveTrans: 'Toevoegen',
    adjustLimits: 'Budgetten instellen', saveLimits: 'Opslaan', deleteConfirm: 'Deze transactie verwijderen?',
    navDashboard: 'Portemonnee', navBudget: 'Limieten', navStats: 'Analyses', navAccount: 'Profiel',
    loading: 'Laden…', noTransactions: 'Geen transacties.',
    categories: { groceries: 'Boodschappen', shopping: 'Winkelen', entertainment: 'Amusement', transport: 'Vervoer', housing: 'Huisvesting', income: 'Inkomsten', other: 'Overig' },
  },
  hi: {
    dir: 'ltr', welcome: 'स्वागत है', balance: 'शुद्ध शेष', income: 'कुल आय', expenses: 'कुल व्यय',
    historyTitle: 'लेनदेन', last5: 'अंतिम 5', budgetTitle: 'बजट सीमा', budgetSubtitle: 'सीमा बनाम वास्तविक व्यय',
    adjust: 'संपादित करें', statsTitle: 'विश्लेषण', statsSubtitle: 'नकदी प्रवाह विश्लेषण', saved: 'शुद्ध बचत',
    burn: 'व्यय दर', distribution: 'वितरण', statsStatus: 'सक्रिय', pref: 'प्राथमिकताएं',
    currency: 'मुद्रा', lang: 'भाषा', theme: 'थीम', dataExport: 'डेटा', exportPdf: 'PDF निर्यात',
    resetData: 'रीसेट करें', logout: 'लॉग आउट', newTrans: 'नया लेनदेन', enterAmt: 'राशि',
    txExpense: 'व्यय', txIncome: 'आय', category: 'श्रेणी', note: 'नोट', saveTrans: 'जोड़ें',
    adjustLimits: 'बजट सेट करें', saveLimits: 'सहेजें', deleteConfirm: 'यह लेनदेन हटाएं?',
    navDashboard: 'बटुआ', navBudget: 'बजट', navStats: 'आँकड़े', navAccount: 'प्रोफ़ाइल',
    loading: 'लोड हो रहा है…', noTransactions: 'कोई लेनदेन नहीं।',
    categories: { groceries: 'किराना', shopping: 'खरीदारी', entertainment: 'मनोरंजन', transport: 'परिवहन', housing: 'आवास', income: 'आय', other: 'अन्य' },
  },
};

// ── Currencies ────────────────────────────────────────────────────────────────
const CURRENCIES = {
  USD: { symbol: '$',    name: 'USD — US Dollar',      position: 'before' },
  EUR: { symbol: '€',    name: 'EUR — Euro',            position: 'before' },
  GBP: { symbol: '£',    name: 'GBP — British Pound',   position: 'before' },
  IRR: { symbol: 'Rial', name: 'IRR — Iranian Rial',    position: 'after',  decimals: 0 },
  SAR: { symbol: 'SAR',  name: 'SAR — Saudi Riyal',     position: 'after' },
  AED: { symbol: 'AED',  name: 'AED — UAE Dirham',      position: 'after' },
  JPY: { symbol: '¥',    name: 'JPY — Japanese Yen',    position: 'before', decimals: 0 },
  RUB: { symbol: '₽',    name: 'RUB — Russian Ruble',   position: 'after' },
  INR: { symbol: '₹',    name: 'INR — Indian Rupee',    position: 'before' },
};

// ── Themes ────────────────────────────────────────────────────────────────────
const THEMES = {
  indigo: {
    name: 'Midnight Indigo',
    gradient: 'from-indigo-600 to-indigo-900',
    primary: 'bg-indigo-600',
    primaryHover: 'hover:bg-indigo-700',
    accent: 'text-indigo-500',
    focusBorder: 'focus:border-indigo-500',
    glow: 'shadow-indigo-600/25',
    pageBg: 'bg-slate-50',
    cardBorder: 'border-slate-100',
    headerBg: 'bg-white border-slate-100',
  },
  emerald: {
    name: 'Forest Emerald',
    gradient: 'from-emerald-600 to-teal-900',
    primary: 'bg-emerald-600',
    primaryHover: 'hover:bg-emerald-700',
    accent: 'text-emerald-500',
    focusBorder: 'focus:border-emerald-500',
    glow: 'shadow-emerald-600/25',
    pageBg: 'bg-slate-50',
    cardBorder: 'border-slate-100',
    headerBg: 'bg-white border-slate-100',
  },
  sunset: {
    name: 'Crimson Sunset',
    gradient: 'from-rose-500 to-orange-700',
    primary: 'bg-rose-500',
    primaryHover: 'hover:bg-rose-600',
    accent: 'text-rose-500',
    focusBorder: 'focus:border-rose-500',
    glow: 'shadow-rose-500/25',
    pageBg: 'bg-slate-50',
    cardBorder: 'border-slate-100',
    headerBg: 'bg-white border-slate-100',
  },
  amethyst: {
    name: 'Royal Amethyst',
    gradient: 'from-purple-600 to-fuchsia-900',
    primary: 'bg-purple-600',
    primaryHover: 'hover:bg-purple-700',
    accent: 'text-purple-500',
    focusBorder: 'focus:border-purple-500',
    glow: 'shadow-purple-600/25',
    pageBg: 'bg-slate-50',
    cardBorder: 'border-slate-100',
    headerBg: 'bg-white border-slate-100',
  },
  obsidian: {
    name: 'Obsidian Steel',
    gradient: 'from-slate-700 to-slate-950',
    primary: 'bg-slate-800',
    primaryHover: 'hover:bg-slate-700',
    accent: 'text-slate-400',
    focusBorder: 'focus:border-slate-500',
    glow: 'shadow-slate-800/25',
    pageBg: 'bg-slate-100',
    cardBorder: 'border-slate-200',
    headerBg: 'bg-white border-slate-200',
  },
};

// ── Category metadata ─────────────────────────────────────────────────────────
const CAT_META = {
  groceries:     { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: '🛒' },
  shopping:      { bg: 'bg-blue-50',    text: 'text-blue-600',    icon: '🛍️' },
  entertainment: { bg: 'bg-violet-50',  text: 'text-violet-600',  icon: '🎮' },
  transport:     { bg: 'bg-amber-50',   text: 'text-amber-600',   icon: '🚗' },
  housing:       { bg: 'bg-rose-50',    text: 'text-rose-600',    icon: '🏠' },
  income:        { bg: 'bg-teal-50',    text: 'text-teal-600',    icon: '💰' },
  other:         { bg: 'bg-slate-50',   text: 'text-slate-500',   icon: '📦' },
};

const EXPENSE_CATEGORIES = ['groceries', 'shopping', 'entertainment', 'transport', 'housing', 'other'];
const ALL_CATEGORIES     = ['groceries', 'shopping', 'entertainment', 'transport', 'housing', 'income', 'other'];

const DEFAULT_BUDGETS = {
  groceries: 500, shopping: 400, entertainment: 300,
  transport: 200, housing: 1500, income: 10000, other: 600,
};

// ── Number / currency helpers ─────────────────────────────────────────────────
function addCommas(val) {
  const str = String(val).replace(/[^0-9.]/g, '');
  const [int, dec] = str.split('.');
  const formatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return dec !== undefined ? `${formatted}.${dec}` : formatted;
}

function parseAmount(str) {
  const n = parseFloat(String(str).replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : n;
}

function formatCurrency(amount, currencyCode, langDir) {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const decimals = curr.decimals ?? 2;
  const num = addCommas(Number(amount).toFixed(decimals));
  if (curr.position === 'after') return `${num} ${curr.symbol}`;
  return langDir === 'rtl' ? `${num} ${curr.symbol}` : `${curr.symbol}${num}`;
}

// ── API helpers ───────────────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('budgetly_token');
  const res = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ── PDF sanitizer (ASCII-safe for jsPDF) ─────────────────────────────────────
function sanitizeForPdf(text) {
  if (!text) return '';
  return text
    .replace(/[^\x20-\x7E]/g, '')
    .trim() || 'Detail';
}

// ── Toast component ───────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="fixed top-4 left-4 right-4 z-50 pointer-events-none flex flex-col gap-2 max-w-md mx-auto">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`animate-toast-in pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl text-xs font-bold ${
            t.type === 'success' ? 'bg-emerald-950 border-emerald-800 text-emerald-200' :
            t.type === 'error'   ? 'bg-rose-950 border-rose-800 text-rose-200' :
                                   'bg-slate-900 border-slate-700 text-white'
          }`}
        >
          <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>
          <span className="flex-1">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user,        setUser]        = useState(null);
  const [authMode,    setAuthMode]    = useState('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError,   setAuthError]   = useState('');
  const [authName,    setAuthName]    = useState('');
  const [authEmail,   setAuthEmail]   = useState('');
  const [authPass,    setAuthPass]    = useState('');

  const [lang,     setLang]     = useState(() => localStorage.getItem('budgetly_lang')     || 'en');
  const [currency, setCurrency] = useState(() => localStorage.getItem('budgetly_currency') || 'USD');
  const [theme,    setTheme]    = useState(() => localStorage.getItem('budgetly_theme')    || 'indigo');
  const [tab,      setTab]      = useState('dashboard');
  const [toasts,   setToasts]   = useState([]);

  const [transactions, setTransactions] = useState([]);
  const [budgets,      setBudgets]      = useState(DEFAULT_BUDGETS);
  const [dataLoading,  setDataLoading]  = useState(false);

  // Transaction modal state
  const [txOpen,     setTxOpen]     = useState(false);
  const [txDisplay,  setTxDisplay]  = useState('');
  const [txRaw,      setTxRaw]      = useState(0);
  const [txType,     setTxType]     = useState('expense');
  const [txCategory, setTxCategory] = useState('groceries');
  const [txNote,     setTxNote]     = useState('');
  const [txSaving,   setTxSaving]   = useState(false);
  const [txError,    setTxError]    = useState('');

  // Budget modal state
  const [budgetOpen,  setBudgetOpen]  = useState(false);
  const [tempBudgets, setTempBudgets] = useState({});
  const [budgetSaving,setBudgetSaving]= useState(false);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState(null);

  const dict  = LANGUAGES[lang]  || LANGUAGES.en;
  const thm   = THEMES[theme]    || THEMES.indigo;
  const isRTL = dict.dir === 'rtl';
  const curr  = CURRENCIES[currency] || CURRENCIES.USD;

  // ── Toast engine ─────────────────────────────────────────────────────────
  const toast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  // ── Persist preferences ───────────────────────────────────────────────────
  useEffect(() => { localStorage.setItem('budgetly_lang',     lang);     }, [lang]);
  useEffect(() => { localStorage.setItem('budgetly_currency', currency); }, [currency]);
  useEffect(() => { localStorage.setItem('budgetly_theme',    theme);    }, [theme]);

  // ── RTL direction ─────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.dir  = dict.dir;
    document.documentElement.lang = lang;
  }, [dict.dir, lang]);

  // ── Restore session on mount ──────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('budgetly_token');
    if (!token) return;
    apiFetch('/api/auth', { method: 'POST', body: { action: 'verify' } })
      .then(d => { setUser(d.user); })
      .catch(() => { localStorage.removeItem('budgetly_token'); });
  }, []);

  // ── Load data when user is set ────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    setDataLoading(true);
    apiFetch('/api/transactions')
      .then(d => {
        setTransactions(d.transactions || []);
        if (d.budget) {
          setBudgets({
            groceries:     Number(d.budget.groceries),
            shopping:      Number(d.budget.shopping),
            entertainment: Number(d.budget.entertainment),
            transport:     Number(d.budget.transport),
            housing:       Number(d.budget.housing),
            income:        Number(d.budget.income),
            other:         Number(d.budget.other),
          });
        }
      })
      .catch(() => toast('Failed to load data.', 'error'))
      .finally(() => setDataLoading(false));
  }, [user]);

  // ── Computed financials ───────────────────────────────────────────────────
  // Income and expense categories are separated properly:
  // - Transactions typed 'income' add to totalIncome (regardless of category)
  // - Transactions typed 'expense' add to totalExpenses and the relevant category spend
  // - The 'income' category spend only tracks income-typed entries for the budget limit row
  const computed = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;
    const catSpend = Object.fromEntries(ALL_CATEGORIES.map(c => [c, 0]));

    for (const tx of transactions) {
      const val = Number(tx.amount) || 0;
      const cat = catSpend[tx.category] !== undefined ? tx.category : 'other';

      if (tx.type === 'income') {
        totalIncome += val;
        catSpend[cat] += val;
      } else {
        totalExpenses += val;
        catSpend[cat] += val;
      }
    }

    const netBalance = totalIncome - totalExpenses;
    const burnRate   = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

    return { totalIncome, totalExpenses, netBalance, burnRate, catSpend };
  }, [transactions]);

  // ── Auth handlers ─────────────────────────────────────────────────────────
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const body = authMode === 'signup'
        ? { action: 'signup', email: authEmail, password: authPass, name: authName }
        : { action: 'login',  email: authEmail, password: authPass };
      const data = await apiFetch('/api/auth', { method: 'POST', body });
      localStorage.setItem('budgetly_token', data.token);
      setUser(data.user);
      toast('Signed in successfully.', 'success');
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('budgetly_token');
    setUser(null);
    setTransactions([]);
    setBudgets(DEFAULT_BUDGETS);
    toast('Signed out.', 'info');
  };

  // ── Transaction handlers ──────────────────────────────────────────────────
  const openTxModal = () => {
    setTxDisplay('');
    setTxRaw(0);
    setTxType('expense');
    setTxCategory('groceries');
    setTxNote('');
    setTxError('');
    setTxOpen(true);
  };

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = raw.split('.');
    const sanitized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : raw;
    setTxDisplay(addCommas(sanitized));
    setTxRaw(parseFloat(sanitized) || 0);
  };

  const saveTransaction = async () => {
    if (txRaw <= 0) { setTxError('Please enter a valid amount.'); return; }
    setTxError('');
    setTxSaving(true);
    try {
      const data = await apiFetch('/api/transactions', {
        method: 'POST',
        body: { action: 'add_transaction', type: txType, amount: txRaw, category: txCategory, note: txNote },
      });
      setTransactions(p => [data.transaction, ...p]);
      setTxOpen(false);
      toast('Transaction added.', 'success');
    } catch (err) {
      setTxError(err.message);
    } finally {
      setTxSaving(false);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await apiFetch('/api/transactions', { method: 'POST', body: { action: 'delete_transaction', id } });
      setTransactions(p => p.filter(t => t.id !== id));
      setDeleteId(null);
      toast('Transaction deleted.', 'info');
    } catch {
      toast('Failed to delete.', 'error');
    }
  };

  // ── Budget handlers ───────────────────────────────────────────────────────
  const openBudgetModal = () => {
    setTempBudgets({ ...budgets });
    setBudgetOpen(true);
  };

  const saveBudgets = async () => {
    setBudgetSaving(true);
    try {
      await apiFetch('/api/transactions', {
        method: 'POST',
        body: { action: 'save_budgets', budgets: tempBudgets },
      });
      setBudgets({ ...tempBudgets });
      setBudgetOpen(false);
      toast('Budgets saved.', 'success');
    } catch {
      toast('Failed to save budgets.', 'error');
    } finally {
      setBudgetSaving(false);
    }
  };

  // ── Reset data ────────────────────────────────────────────────────────────
  const resetData = async () => {
    try {
      const data = await apiFetch('/api/transactions', {
        method: 'POST',
        body: { action: 'reset_transactions' },
      });
      setTransactions(data.transactions || []);
      setBudgets(DEFAULT_BUDGETS);
      toast('Reset to sample data.', 'success');
    } catch {
      toast('Reset failed.', 'error');
    }
  };

  // ── PDF Export ────────────────────────────────────────────────────────────
  const exportPDF = async () => {
    try {
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
      const doc = new jsPDF('p', 'mm', 'a4');

      const decimals = curr.decimals ?? 2;
      const sym = curr.symbol.replace(/[^\x20-\x7E]/g, '') || currency;
      const fmt = (n) => `${addCommas(Number(n).toFixed(decimals))} ${sym}`;

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 48, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('BUDGETLY — FINANCIAL SUMMARY', 15, 20);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(180, 180, 180);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 28);
      doc.text(`Net Balance: ${fmt(computed.netBalance)}   Income: ${fmt(computed.totalIncome)}   Expenses: ${fmt(computed.totalExpenses)}`, 15, 36);

      doc.setTextColor(40, 40, 40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('CATEGORY BUDGET STATUS', 15, 60);
      doc.setDrawColor(220, 220, 220);
      doc.line(15, 63, 195, 63);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');

      let y = 70;
      for (const cat of ALL_CATEGORIES) {
        doc.setFont('helvetica', 'bold');
        doc.text(sanitizeForPdf(cat.charAt(0).toUpperCase() + cat.slice(1)), 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`Spent: ${fmt(computed.catSpend[cat])}`, 90, y);
        doc.text(`Limit: ${fmt(budgets[cat])}`, 148, y);
        doc.setDrawColor(240, 240, 240);
        doc.line(15, y + 3, 195, y + 3);
        y += 10;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('TRANSACTION HISTORY', 15, y + 8);
      doc.line(15, y + 11, 195, y + 11);
      y += 18;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('Date', 15, y);
      doc.text('Category', 48, y);
      doc.text('Note', 88, y);
      doc.text('Amount', 170, y);
      doc.line(15, y + 2, 195, y + 2);
      doc.setFont('helvetica', 'normal');
      y += 8;

      for (const tx of transactions) {
        if (y > 272) { doc.addPage(); y = 20; }
        const sign = tx.type === 'expense' ? '-' : '+';
        doc.text(new Date(tx.date).toLocaleDateString(), 15, y);
        doc.text(sanitizeForPdf(tx.category), 48, y);
        doc.text(sanitizeForPdf(tx.note).slice(0, 38), 88, y);
        doc.text(`${sign}${fmt(tx.amount)}`, 165, y);
        doc.setDrawColor(245, 245, 245);
        doc.line(15, y + 3, 195, y + 3);
        y += 8;
      }

      doc.setFontSize(7);
      doc.setTextColor(160, 160, 160);
      doc.text('Budgetly — Secure personal finance tracker. Report generated client-side.', 15, 288);
      doc.save(`budgetly-${Date.now()}.pdf`);
      toast('PDF exported.', 'success');
    } catch (err) {
      console.error(err);
      toast('PDF export failed.', 'error');
    }
  };

  const fmt = (n) => formatCurrency(n, currency, dict.dir);

  // ── Render: Auth screen ───────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="h-full w-full bg-slate-950 flex items-center justify-center p-4">
        <Toast toasts={toasts} />
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/30">
              <span className="text-3xl">💼</span>
            </div>
            <h1 className="text-3xl font-display text-white tracking-tight">Budgetly</h1>
            <p className="text-xs text-slate-500 mt-1 font-body uppercase tracking-widest">Personal Finance Tracker</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="flex border-b border-slate-800 mb-6">
              {['login', 'signup'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setAuthMode(m); setAuthError(''); }}
                  className={`flex-1 pb-3 text-sm font-bold transition-colors ${
                    authMode === m ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500'
                  }`}
                >
                  {m === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text" required placeholder="Jane Doe"
                    value={authName} onChange={e => setAuthName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              )}
              <div>
                <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Email</label>
                <input
                  type="email" required placeholder="you@example.com"
                  value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Password</label>
                <input
                  type="password" required placeholder="••••••••" minLength={6}
                  value={authPass} onChange={e => setAuthPass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {authError && (
                <p className="text-rose-400 text-xs font-semibold bg-rose-950/50 border border-rose-900 rounded-xl px-3 py-2">
                  {authError}
                </p>
              )}

              <button
                type="submit" disabled={authLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-sm mt-2"
              >
                {authLoading ? 'Please wait…' : authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>

          <p className="text-center text-slate-600 text-xs mt-6">
            Secured by Neon serverless Postgres
          </p>
        </div>
      </div>
    );
  }

  // ── Render: Main app ──────────────────────────────────────────────────────
  return (
    <div className={`h-full w-full ${isRTL ? 'font-vazirmatn' : 'font-body'} bg-slate-200 flex items-center justify-center sm:p-4 text-slate-800`}>
      <Toast toasts={toasts} />

      <div className="w-full max-w-md h-[100dvh] sm:h-[860px] sm:rounded-[3rem] bg-white shadow-2xl relative overflow-hidden flex flex-col border border-slate-100">

        {/* Header */}
        <header className={`${thm.headerBg} border-b px-5 pt-5 pb-4 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300`}>
          <div className="flex items-center gap-3">
            <div className={`${thm.primary} text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm`}>
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{dict.welcome}</p>
              <h4 className="text-sm font-bold text-slate-800 leading-tight">{user.name}</h4>
            </div>
          </div>
          {dataLoading && <span className="text-[10px] text-slate-400 animate-pulse">{dict.loading}</span>}
        </header>

        {/* Scrollable main content */}
        <main className={`flex-1 overflow-y-auto px-5 pt-4 pb-32 ${thm.pageBg} transition-colors duration-300`}>

          {/* ── Dashboard tab ───────────────────────────────────────────── */}
          {tab === 'dashboard' && (
            <div className="space-y-5 animate-fade-in">
              <div className={`bg-gradient-to-br ${thm.gradient} text-white rounded-[2rem] p-6 shadow-xl ${thm.glow} relative overflow-hidden`}>
                <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider mb-1">{dict.balance}</p>
                <h1 className="text-4xl font-display tracking-tight">{fmt(computed.netBalance)}</h1>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: dict.income,   val: computed.totalIncome,   icon: '📈', col: 'bg-emerald-50 text-emerald-600' },
                  { label: dict.expenses, val: computed.totalExpenses, icon: '📉', col: 'bg-rose-50 text-rose-600' },
                ].map(({ label, val, icon, col }) => (
                  <div key={label} className={`bg-white border ${thm.cardBorder} rounded-2xl p-4 flex items-center gap-3`}>
                    <div className={`w-10 h-10 ${col} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>{icon}</div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-extrabold text-slate-800 truncate">{fmt(val)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-extrabold text-slate-800">{dict.historyTitle}</h3>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{dict.last5}</span>
                </div>
                <div className="space-y-2">
                  {transactions.slice(0, 5).map(tx => {
                    const meta = CAT_META[tx.category] || CAT_META.other;
                    return (
                      <div
                        key={tx.id}
                        className={`bg-white border ${thm.cardBorder} p-4 rounded-2xl flex items-center justify-between gap-2`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 ${meta.bg} ${meta.text} rounded-xl flex items-center justify-center text-base flex-shrink-0`}>
                            {meta.icon}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-extrabold text-slate-800 truncate">{tx.note || dict.categories[tx.category] || tx.category}</h4>
                            <p className="text-[9px] text-slate-400 font-bold">
                              {dict.categories[tx.category] || tx.category} · {new Date(tx.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs font-black ${tx.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {tx.type === 'expense' ? '−' : '+'}{fmt(tx.amount)}
                          </span>
                          <button
                            onClick={() => setDeleteId(tx.id)}
                            className="w-6 h-6 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-500 text-slate-400 flex items-center justify-center text-xs transition-colors"
                            aria-label="Delete"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {transactions.length === 0 && !dataLoading && (
                    <div className="text-center py-12 text-slate-400 bg-white border border-dashed border-slate-200 rounded-2xl">
                      <p className="text-2xl mb-2">💸</p>
                      <p className="text-xs">{dict.noTransactions}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Budget tab ───────────────────────────────────────────────── */}
          {tab === 'budget' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800">{dict.budgetTitle}</h2>
                  <p className="text-xs text-slate-400">{dict.budgetSubtitle}</p>
                </div>
                <button
                  onClick={openBudgetModal}
                  className={`bg-white border ${thm.cardBorder} hover:bg-slate-50 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 transition-colors flex items-center gap-1`}
                >
                  ⚙️ {dict.adjust}
                </button>
              </div>

              <div className="space-y-3">
                {ALL_CATEGORIES.map(cat => {
                  const spent = computed.catSpend[cat] || 0;
                  const limit = budgets[cat] || 0;
                  const pct   = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
                  const meta  = CAT_META[cat] || CAT_META.other;
                  const barColor = pct >= 90 ? 'bg-rose-500' : pct >= 70 ? 'bg-amber-500' : thm.primary;

                  return (
                    <div key={cat} className={`bg-white border ${thm.cardBorder} rounded-2xl p-4 space-y-3`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-8 h-8 ${meta.bg} ${meta.text} rounded-lg flex items-center justify-center text-sm`}>{meta.icon}</span>
                          <span className="text-xs font-bold text-slate-800">{dict.categories[cat]}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">{pct.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} transition-all duration-500 rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                        <span>{dict.expenses.split(' ')[0]}: <strong className="text-slate-700">{fmt(spent)}</strong></span>
                        <span>Limit: <strong className="text-slate-700">{fmt(limit)}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Stats tab ────────────────────────────────────────────────── */}
          {tab === 'stats' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800">{dict.statsTitle}</h2>
                <p className="text-xs text-slate-400">{dict.statsSubtitle}</p>
              </div>

              <div className={`grid grid-cols-2 gap-3 bg-white border ${thm.cardBorder} p-3 rounded-2xl`}>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">{dict.saved}</span>
                  <span className={`text-sm font-extrabold ${computed.netBalance >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {fmt(computed.netBalance)}
                  </span>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">{dict.burn}</span>
                  <span className={`text-sm font-extrabold ${computed.burnRate > 90 ? 'text-rose-500' : 'text-slate-800'}`}>
                    {computed.burnRate.toFixed(1)}%
                  </span>
                </div>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-16 text-slate-400 bg-white border border-dashed border-slate-200 rounded-2xl">
                  <p className="text-3xl mb-2">📊</p>
                  <p className="text-xs">{dict.noTransactions}</p>
                </div>
              ) : (
                <div className={`bg-white border ${thm.cardBorder} rounded-3xl p-5 space-y-4`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{dict.distribution}</span>
                    <span className={`text-[9px] ${thm.accent} font-bold px-2 py-0.5 rounded-full bg-slate-50`}>{dict.statsStatus}</span>
                  </div>
                  <div className="space-y-3 pt-1">
                    {(() => {
                      // Only show expense categories in distribution (income is shown separately)
                      const maxVal = Math.max(...EXPENSE_CATEGORIES.map(c => computed.catSpend[c]), 1);
                      return EXPENSE_CATEGORIES.map(cat => {
                        const spent = computed.catSpend[cat] || 0;
                        const pct   = (spent / maxVal) * 100;
                        const meta  = CAT_META[cat] || CAT_META.other;
                        return (
                          <div key={cat} className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="font-bold text-slate-600 flex items-center gap-1.5">
                                <span>{meta.icon}</span>{dict.categories[cat]}
                              </span>
                              <span className="font-black text-slate-800">{fmt(spent)}</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${thm.primary} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Account tab ──────────────────────────────────────────────── */}
          {tab === 'account' && (
            <div className="space-y-4 animate-fade-in">
              <div className={`bg-white border ${thm.cardBorder} p-5 rounded-2xl text-center flex flex-col items-center`}>
                <div className={`w-14 h-14 ${thm.primary} text-white rounded-full flex items-center justify-center font-bold text-lg mb-2 shadow-md`}>
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <h3 className="text-base font-extrabold text-slate-800">{user.name}</h3>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>

              <div className={`bg-white border ${thm.cardBorder} rounded-2xl p-4 space-y-4`}>
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{dict.pref}</h4>

                {[
                  { label: dict.theme,    value: theme,    setter: setTheme,    opts: Object.entries(THEMES).map(([k,v]) => [k, v.name]) },
                  { label: dict.currency, value: currency, setter: setCurrency, opts: Object.entries(CURRENCIES).map(([k,v]) => [k, v.name]) },
                  { label: dict.lang,     value: lang,     setter: setLang,     opts: Object.entries(LANGUAGES).map(([k,v]) => [k, k.toUpperCase()]) },
                ].map(({ label, value, setter, opts }) => (
                  <div key={label}>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{label}</label>
                    <select
                      value={value}
                      onChange={e => setter(e.target.value)}
                      className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none ${thm.focusBorder} transition-colors`}
                    >
                      {opts.map(([k, n]) => <option key={k} value={k}>{n}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div className={`bg-white border ${thm.cardBorder} rounded-2xl p-4 space-y-3`}>
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{dict.dataExport}</h4>
                <button
                  onClick={exportPDF}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  📄 {dict.exportPdf}
                </button>
                <button
                  onClick={resetData}
                  className="w-full bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs"
                >
                  🔄 {dict.resetData}
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
              >
                🚪 {dict.logout}
              </button>
            </div>
          )}
        </main>

        {/* ── Bottom nav ─────────────────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 z-30 safe-bottom px-4 pb-4 pt-0">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-2xl py-3 px-2 grid grid-cols-5 items-center">
            {[
              { id: 'dashboard', icon: '💳', label: dict.navDashboard },
              { id: 'budget',    icon: '🎯', label: dict.navBudget    },
              { id: 'fab',       icon: '+',  label: ''                },
              { id: 'stats',     icon: '📊', label: dict.navStats     },
              { id: 'account',   icon: '👤', label: dict.navAccount   },
            ].map(item => {
              if (item.id === 'fab') {
                return (
                  <div key="fab" className="flex justify-center">
                    <button
                      onClick={openTxModal}
                      className={`w-14 h-14 -mt-8 ${thm.primary} ${thm.primaryHover} text-white rounded-full flex items-center justify-center shadow-xl border-4 border-slate-900 transition-all active:scale-95`}
                      aria-label="Add transaction"
                    >
                      <span className="text-2xl font-light leading-none">+</span>
                    </button>
                  </div>
                );
              }
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`flex flex-col items-center gap-1 py-1 transition-all ${
                    tab === item.id ? `${thm.accent} scale-105` : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-[9px] font-bold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Add Transaction modal ───────────────────────────────────────── */}
        {txOpen && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end">
            <div className="bg-white rounded-t-[2.5rem] w-full p-6 pb-10 space-y-4 animate-slide-up">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-800">{dict.newTrans}</h3>
                <button
                  onClick={() => setTxOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold hover:bg-slate-200 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-2">{dict.enterAmt}</span>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-lg font-bold text-slate-300">{curr.position === 'before' ? curr.symbol : ''}</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0"
                    value={txDisplay}
                    onChange={handleAmountChange}
                    style={{ width: `${Math.max(txDisplay.length + 1, 3)}ch` }}
                    className="bg-transparent text-3xl font-display text-slate-800 text-center focus:outline-none min-w-[3ch] max-w-[180px]"
                  />
                  <span className="text-lg font-bold text-slate-300">{curr.position === 'after' ? curr.symbol : ''}</span>
                </div>
                {txError && <p className="text-rose-500 text-xs font-semibold mt-2">{txError}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                {['expense', 'income'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTxType(t);
                      setTxCategory(t === 'income' ? 'income' : 'groceries');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                      txType === t
                        ? t === 'expense' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                        : 'text-slate-500'
                    }`}
                  >
                    {t === 'expense' ? dict.txExpense : dict.txIncome}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{dict.category}</label>
                <select
                  value={txCategory}
                  onChange={e => setTxCategory(e.target.value)}
                  className={`w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-3 text-sm focus:outline-none ${thm.focusBorder} transition-colors`}
                >
                  {(txType === 'income' ? ['income', 'other'] : EXPENSE_CATEGORIES).map(c => (
                    <option key={c} value={c}>{CAT_META[c]?.icon} {dict.categories[c]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{dict.note}</label>
                <input
                  type="text"
                  placeholder="e.g. Starbucks, Amazon"
                  value={txNote}
                  onChange={e => setTxNote(e.target.value)}
                  className={`w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-3 text-sm focus:outline-none ${thm.focusBorder} transition-colors`}
                />
              </div>

              <button
                onClick={saveTransaction}
                disabled={txSaving}
                className={`w-full ${thm.primary} ${thm.primaryHover} disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors text-sm`}
              >
                {txSaving ? '…' : dict.saveTrans}
              </button>
            </div>
          </div>
        )}

        {/* ── Budget modal ────────────────────────────────────────────────── */}
        {budgetOpen && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end">
            <div className="bg-white rounded-t-[2.5rem] w-full p-6 space-y-4 max-h-[85dvh] overflow-y-auto animate-slide-up">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 sticky top-0 bg-white">
                <h3 className="text-base font-extrabold text-slate-800">{dict.adjustLimits}</h3>
                <button
                  onClick={() => setBudgetOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2 pb-2">
                {ALL_CATEGORIES.map(cat => {
                  const meta = CAT_META[cat] || CAT_META.other;
                  return (
                    <div key={cat} className="flex items-center justify-between gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={`w-8 h-8 ${meta.bg} ${meta.text} rounded-lg flex items-center justify-center text-sm flex-shrink-0`}>
                          {meta.icon}
                        </span>
                        <span className="text-xs font-bold text-slate-700 truncate">{dict.categories[cat]}</span>
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={addCommas(tempBudgets[cat] ?? '')}
                        onChange={e => {
                          const val = parseAmount(e.target.value);
                          setTempBudgets(p => ({ ...p, [cat]: val }));
                        }}
                        className={`w-28 bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-xs font-bold text-right focus:outline-none ${thm.focusBorder} transition-colors`}
                      />
                    </div>
                  );
                })}
              </div>
              <button
                onClick={saveBudgets}
                disabled={budgetSaving}
                className={`w-full ${thm.primary} ${thm.primaryHover} disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors text-sm sticky bottom-0`}
              >
                {budgetSaving ? '…' : dict.saveLimits}
              </button>
            </div>
          </div>
        )}

        {/* ── Delete confirmation dialog ──────────────────────────────────── */}
        {deleteId && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center animate-fade-in">
              <p className="text-sm font-bold text-slate-800 mb-6">{dict.deleteConfirm}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteTransaction(deleteId)}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
