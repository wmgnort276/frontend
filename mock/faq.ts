import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

mock.onGet('/api/faq_menu').reply(200, {
  faq_side_menu: [
    {
      title: '社会保険(50)',
      key: '0-1',
      children: [
        {
          title: '住所変更(20)',
          key: '0-2-0',
          children: [
            {
              title: '本人確認書類(80)',
              key: '0-2-0-1',
              children: [
                { title: '同意書(30)', key: '0-3-0-0', style: 'margin-left:20px' },
                { title: '扶養異動届(50)', key: '0-3-0-1', style: 'margin-left:20px' }
              ]
            }
          ]
        }
      ]
    },
    {
      title: '年末調整(100)',
      key: '0-2',
      children: [
        {
          title: '住所変更(20)',
          key: '0-2-0',
          children: [
            {
              title: '本人確認書類(80)',
              key: '0-2-0-1',
              children: [
                { title: '同意書(30)', key: '0-3-0-0', style: 'margin-left:20px' },
                { title: '扶養異動届(50)', key: '0-3-0-1', style: 'margin-left:20px' }
              ]
            }
          ]
        }
      ]
    },
    {
      title: '健康保険(60)',
      key: '0-3',
      children: [
        {
          title: '健康保険(60)',
          key: '0-3-0',
          children: []
        }
      ]
    },
    {
      title: '雇用保険(60)',
      key: '0-4',
      children: [
        {
          title: '雇用保険(60)',
          key: '0-4-0',
          children: []
        }
      ]
    }
  ]
});

mock.onGet('/api/faq_search').reply(200, {
  faq_data_search: [
    { title: '年末調整の精算を「現金」で行う場合も［過不足税額の精算］処理は必要ですか？' },
    { title: '基・配・所控除申告書の基礎控除、配偶者（特別）控除の額が計算されない' },
    { title: '年末調整の申告書入力は、給与（賞与）計算前でも入力できますか？' },
    { title: '令和5年 協会けんぽ 健康保険料率・介護保険料率を変更するタイミング' },
    { title: '定年退職者に対する海外慰安旅行についての課税関係' },
    { title: '生存給付金付定期保険に基づく生存給付金に係る一時所得の金額の計算' },
    { title: '特定健康診査と特定保健指導が年をまたがって行われた場合' },
    { title: '1枚の生命保険料控除証明書に旧生命保険料と新生命保険料の記載がある場合' },
    { title: '住宅ローン控除・繰上返済等をした場合の償還期間' },
    { title: '1枚の生命保険料控除証明書に旧生命保険料と新生命保険料の記載がある場合' }
  ]
});

mock.onGet('/api/affiliated_company_options').reply(200, {
  company_options: [
    { label: 'Company 1', value: 'Company_1' },
    { label: 'Company 2', value: 'Company_2' },
    { label: 'Company 3', value: 'Company_3' },
    { label: 'Company 4', value: 'Company_4' },
    { label: 'Company 5', value: 'Company_5' }
  ]
});

mock.onGet('/api/faq_code_options').reply(200, {
  faq_code_options: [
    { label: 'FAQ Code 1', value: 'FAQ Code 1' },
    { label: 'FAQ Code 2', value: 'FAQ Code 2' },
    { label: 'FAQ Code 3', value: 'FAQ Code 3' },
    { label: 'FAQ Code 4', value: 'FAQ Code 4' },
    { label: 'FAQ Code 5', value: 'FAQ Code 5' }
  ]
});

mock.onGet('/api/business_code_options').reply(200, {
  business_code_options: [
    { label: 'Business1', value: 'Business1' },
    { label: 'Business2', value: 'Business2' },
    { label: 'Business3', value: 'Business3' },
    { label: 'Business4', value: 'Business4' },
    { label: 'Business5', value: 'Business5' }
  ]
});

mock.onGet('/api/faq_category_options').reply(200, {
  category_code_options: [
    { label: 'Category 1', value: 'category_1' },
    { label: 'Category 2', value: 'category_2' },
    { label: 'Category 3', value: 'category_3' },
    { label: 'Category 4', value: 'category_4' },
    { label: 'Category 5', value: 'category_5' }
  ]
});

mock.onGet('/api/faq-details/11').reply(200, {
  qaNumber: 'Q&A No.0999',
  questionName: '年末調整の精算を「現金」で行う場合も［過不足税額の精算］処理は必要ですか？',
  qaAnswerContent: `年末調整の精算を「現金」で行う場合であっても、［過不足税額の精算］の処理は必要です。 ［過不足税額の精算］による［給与明細］や［賞与明細］への転記は必要ありませんが、［年調明細書］を印刷した際に「支給日」が表示されず、「（精算未済）」という文字が印刷されるため、［過不足税額の精算］を行っていただくことをお勧めします。 ［過不足税額の精算］の手順は、 過不足税額の精算は何度でもできますか？を参照してください。`,
  urlList: [
    {
      urlName: 'Url name',
      urlLink: 'https:/kaopizzzz/projects/EMPOR'
    },
    {
      urlName: 'Url name',
      urlLink: 'https:/kaopizzzz/projects/EMPOR'
    }
  ],
  relatedFile: [
    '関連リンク：関連FAQ-001',
    '添付ファイル：本人確認書類 (5 MB)',
    '添付ファイル：○○フォーマット (1 MB)'
  ]
});
export default axios;
