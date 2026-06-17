import type {
  User,
  UserStats,
  Course,
  Lesson,
  Exercise,
  Word,
  Dictionary,
  DictionaryGroup,
  Post,
  Comment,
  TranslationOrder,
  Badge,
  WeeklyTrendPoint,
  CategoryRadarPoint,
} from '@/types';

const IMG_API = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image';
const img = (prompt: string, size: 'landscape_16_9' | 'landscape_4_3' | 'portrait_4_3' | 'portrait_16_9' | 'square_hd' | 'square' = 'landscape_16_9') =>
  `${IMG_API}?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;

export const mockUser: User = {
  id: 'u001',
  name: '李明轩',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  email: 'limingxuan@example.com',
  level: 8,
  exp: 4280,
  dailyStreak: 23,
  signLanguageLevel: 'intermediate',
  bio: '先天性听障，热爱生活，正在努力学习手语，希望能更好地融入社会。梦想成为一名手语翻译志愿者，帮助更多像我一样的人。',
  createdAt: '2025-09-15T08:30:00Z',
};

export const mockBadges: Badge[] = [
  { id: 'b001', name: '初学家门', icon: '🎓', description: '完成第一门手语入门课程', unlockedAt: '2025-10-02T10:15:00Z' },
  { id: 'b002', name: '坚持之星', icon: '🔥', description: '连续打卡学习7天', unlockedAt: '2025-10-08T19:30:00Z' },
  { id: 'b003', name: '词汇达人', icon: '📖', description: '掌握50个手语词汇', unlockedAt: '2025-10-25T14:20:00Z' },
  { id: 'b004', name: '社区新星', icon: '💬', description: '发布第一条社区帖子', unlockedAt: '2025-11-03T21:05:00Z' },
  { id: 'b005', name: '热心助人', icon: '❤️', description: '完成第一次翻译服务', unlockedAt: '2025-11-15T16:45:00Z' },
  { id: 'b006', name: '练习先锋', icon: '🎯', description: '完成第一个练习作业', unlockedAt: '2025-11-20T11:30:00Z' },
];

export const mockUserStats: UserStats = {
  totalLessons: 24,
  completedLessons: 12,
  totalWords: 500,
  learnedWords: 86,
  totalExercises: 72,
  correctExercises: 61,
  totalPosts: 5,
  totalLikes: 186,
  translationOrders: 3,
  badges: mockBadges,
};

const courseList = [
  {
    id: 'c001', title: '手语入门：零基础第一课',
    cover: img('手语学习入门课程封面 温暖教育风格 手势插画 简约现代'),
    desc: '专为零基础学员设计的手语入门课程，从最基础的指语字母开始，逐步学习日常问候、数字表达等核心内容，轻松开启手语学习之旅。',
    level: 'beginner' as const, category: '基础入门',
    tags: ['入门', '零基础', '字母', '问候'], duration: 180, students: 8526, rating: 4.9, completed: 3, total: 3,
  },
  {
    id: 'c002', title: '日常生活手语速成',
    cover: img('日常生活手语课程封面 温馨家庭场景 手势沟通 温暖色调'),
    desc: '涵盖衣食住行全方位的日常生活手语表达，让你轻松应对购物、用餐、出行等各类生活场景，实现独立生活无障碍。',
    level: 'beginner' as const, category: '日常生活',
    tags: ['生活', '购物', '餐饮', '交通'], duration: 240, students: 6234, rating: 4.8, completed: 2, total: 3,
  },
  {
    id: 'c003', title: '医院就医手语实战',
    cover: img('医院就医手语课程封面 医疗场景 医生患者沟通 专业风格'),
    desc: '系统学习医院各科室就医场景手语，包括挂号、问诊、取药、体检等流程，配套医疗专业词汇，保障就医沟通无障碍。',
    level: 'intermediate' as const, category: '医疗就诊',
    tags: ['医院', '看病', '健康', '问诊'], duration: 270, students: 4128, rating: 4.9, completed: 1, total: 3,
  },
  {
    id: 'c004', title: '职场面试与工作沟通',
    cover: img('职场手语课程封面 办公室场景 商务沟通 专业简洁'),
    desc: '从简历投递到入职工作，全程覆盖职场手语需求。学习自我介绍、会议发言、工作汇报等专业表达，助力职业发展。',
    level: 'intermediate' as const, category: '职场沟通',
    tags: ['职场', '面试', '工作', '商务'], duration: 300, students: 2876, rating: 4.7, completed: 0, total: 3,
  },
  {
    id: 'c005', title: '学校课堂手语规范',
    cover: img('教育学习手语课程封面 教室场景 师生互动 明亮清新'),
    desc: '面向学生群体的校园场景手语课程，涵盖课堂提问、作业讨论、考试答题等教育场景，帮助听障学生融入校园学习。',
    level: 'beginner' as const, category: '教育学习',
    tags: ['教育', '学校', '学习', '考试'], duration: 210, students: 5342, rating: 4.8, completed: 0, total: 3,
  },
  {
    id: 'c006', title: '法律事务手语专业版',
    cover: img('法律事务手语课程封面 法庭场景 正义天平 庄重严肃'),
    desc: '专业法律场景手语课程，覆盖咨询、调解、出庭等法律流程，学习法律术语的规范表达，维护自身合法权益。',
    level: 'advanced' as const, category: '法律事务',
    tags: ['法律', '法院', '律师', '权益'], duration: 330, students: 1523, rating: 4.9, completed: 0, total: 3,
  },
  {
    id: 'c007', title: '家庭与情感表达',
    cover: img('家庭情感手语课程封面 温馨家庭 亲子互动 暖色调'),
    desc: '学习家庭成员称谓、情感表达、日常家事沟通等手语，增进与家人的情感交流，构建温馨和谐的家庭沟通环境。',
    level: 'beginner' as const, category: '日常生活',
    tags: ['家庭', '情感', '亲子', '亲情'], duration: 195, students: 7125, rating: 4.9, completed: 3, total: 3,
  },
  {
    id: 'c008', title: '旅行与出行手语宝典',
    cover: img('旅行手语课程封面 旅游场景 行李箱景点 轻松活泼'),
    desc: '旅行全流程手语指南，涵盖购票、住宿、问路、景点游览等场景，让你走遍天下都不怕，无障碍享受旅行乐趣。',
    level: 'beginner' as const, category: '日常生活',
    tags: ['旅行', '酒店', '问路', '景点'], duration: 255, students: 3890, rating: 4.8, completed: 0, total: 3,
  },
];

export const mockCourses: Course[] = courseList.map((c) => ({
  id: c.id,
  title: c.title,
  description: c.desc,
  cover: c.cover,
  level: c.level,
  category: c.category,
  totalLessons: c.total,
  completedLessons: c.completed,
  rating: c.rating,
  students: c.students,
  duration: c.duration,
  tags: c.tags,
}));

const makeExercises = (lessonId: string, count: number): Exercise[] => {
  const types: Array<'choice' | 'match' | 'sign'> = ['choice', 'match', 'sign'];
  const questions = [
    '以下哪个手势表示"你好"？',
    '请选择表示"谢谢"的正确手势动作',
    '匹配下列词汇与对应的手语描述',
    '请按照顺序排列表示"对不起"的手势步骤',
    '录制你表达"再见"的手语动作视频',
    '选择表示"吃饭"的正确手型',
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: `${lessonId}_ex${i + 1}`,
    lessonId,
    type: types[i % 3],
    question: questions[i % questions.length],
    options: i % 3 === 2 ? undefined : ['选项A：握拳上下移动', '选项B：伸掌左右挥动', '选项C：拇指翘起', '选项D：食指指向前方'],
    answer: i % 3 === 1 ? [1, 3, 0, 2] : 'B',
    points: 10 + i * 2,
  }));
};

const lessonsData: Record<string, { title: string; duration: number; exercises: number }[]> = {
  c001: [
    { title: '认识指语字母A-I与基础问候', duration: 612, exercises: 4 },
    { title: '数字1-20与时间表达', duration: 688, exercises: 5 },
    { title: '日常问候与自我介绍', duration: 745, exercises: 4 },
  ],
  c002: [
    { title: '餐厅点单与结账', duration: 812, exercises: 5 },
    { title: '超市购物与砍价', duration: 856, exercises: 4 },
    { title: '公共交通出行', duration: 798, exercises: 5 },
  ],
  c003: [
    { title: '挂号与分诊导诊', duration: 890, exercises: 5 },
    { title: '与医生沟通病情', duration: 945, exercises: 6 },
    { title: '取药与复诊须知', duration: 876, exercises: 4 },
  ],
  c004: [
    { title: '简历介绍与面试问答', duration: 980, exercises: 6 },
    { title: '日常办公场景对话', duration: 1024, exercises: 5 },
    { title: '同事协作与沟通', duration: 965, exercises: 5 },
  ],
  c005: [
    { title: '课堂提问与回答', duration: 720, exercises: 4 },
    { title: '学科与专业术语', duration: 756, exercises: 5 },
    { title: '校园生活沟通', duration: 698, exercises: 4 },
  ],
  c006: [
    { title: '法律咨询与援助', duration: 1080, exercises: 6 },
    { title: '调解与协商流程', duration: 1120, exercises: 5 },
    { title: '法庭庭审手语', duration: 1165, exercises: 6 },
  ],
  c007: [
    { title: '家庭成员称谓', duration: 652, exercises: 4 },
    { title: '情感与感受表达', duration: 678, exercises: 5 },
    { title: '家务与生活安排', duration: 634, exercises: 4 },
  ],
  c008: [
    { title: '酒店入住与退房', duration: 834, exercises: 5 },
    { title: '问路与景点游览', duration: 868, exercises: 5 },
    { title: '突发事件求助', duration: 812, exercises: 4 },
  ],
};

export const mockLessons: Record<string, Lesson[]> = {};
Object.entries(lessonsData).forEach(([courseId, list]) => {
  const completedMap = courseList.find((c) => c.id === courseId)?.completed || 0;
  mockLessons[courseId] = list.map((l, idx) => ({
    id: `${courseId}_l${idx + 1}`,
    courseId,
    title: l.title,
    content: `本节课将详细学习「${l.title}」相关的手语表达，包含标准动作演示、易错点提示和场景模拟练习。建议观看视频过程中跟随模仿，完成课后练习题巩固学习效果。`,
    videoUrl: '',
    order: idx + 1,
    duration: l.duration,
    completed: idx < completedMap,
    exercises: makeExercises(`${courseId}_l${idx + 1}`, l.exercises),
  }));
});

const vocabCategories: Record<string, { cat: string; subs: string[] }> = {
  daily: { cat: '日常生活', subs: ['称谓', '饮食', '服饰', '居住', '出行', '娱乐', '天气', '时间'] },
  medical: { cat: '医疗就诊', subs: ['症状', '科室', '药品', '检查', '身体部位', '就医流程'] },
  business: { cat: '职场沟通', subs: ['求职面试', '办公用语', '会议发言', '商务谈判', '同事相处'] },
  education: { cat: '教育学习', subs: ['学科知识', '校园生活', '课堂用语', '考试升学', '图书馆'] },
  legal: { cat: '法律事务', subs: ['法律术语', '诉讼流程', '合同协议', '权益保护', '调解仲裁'] },
};

const wordBank: Record<string, string[][]> = {
  daily: [
    ['爷爷', '奶奶', '爸爸', '妈妈', '哥哥', '姐姐', '弟弟', '妹妹', '丈夫', '妻子', '儿子', '女儿', '朋友', '邻居', '同事', '老板', '员工', '顾客', '医生', '护士', '老师', '学生', '警察', '司机', '厨师'],
    ['米饭', '面条', '馒头', '饺子', '包子', '粥', '汤', '炒菜', '火锅', '烧烤', '咖啡', '牛奶', '果汁', '啤酒', '茶', '水果', '蔬菜', '肉', '鱼', '鸡蛋', '面包', '蛋糕', '冰淇淋', '巧克力', '糖果'],
    ['衣服', '裤子', '裙子', '外套', '毛衣', '衬衫', 'T恤', '鞋子', '袜子', '帽子', '围巾', '手套', '眼镜', '手表', '项链', '耳环', '戒指', '包', '行李箱', '雨伞', '睡衣', '内衣', '皮带', '钱包', '钥匙'],
    ['家', '客厅', '卧室', '厨房', '卫生间', '阳台', '窗户', '门', '床', '桌子', '椅子', '沙发', '电视', '冰箱', '洗衣机', '空调', '电灯', '开关', '水龙头', '镜子', '衣柜', '书架', '垃圾桶', '扫帚', '拖把'],
    ['走路', '跑步', '自行车', '电动车', '汽车', '公交车', '地铁', '火车', '飞机', '轮船', '出租车', '加油站', '停车场', '红绿灯', '斑马线', '天桥', '隧道', '车票', '座位', '行李', '安检', '登机', '到站', '换乘', '迷路'],
    ['唱歌', '跳舞', '看电影', '听音乐', '画画', '看书', '下棋', '打牌', '游戏', '运动', '游泳', '篮球', '足球', '羽毛球', '爬山', '露营', '野餐', '旅游', '拍照', '购物', '逛街', '理发', '按摩', '健身', '瑜伽'],
    ['晴天', '阴天', '多云', '下雨', '下雪', '刮风', '打雷', '闪电', '雾霾', '台风', '冷', '热', '温暖', '凉爽', '潮湿', '干燥', '温度', '春天', '夏天', '秋天', '冬天', '天气预报', '降温', '升温', '暴雨'],
    ['早上', '中午', '下午', '晚上', '凌晨', '昨天', '今天', '明天', '后天', '前天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天', '一月', '二月', '三月', '新年', '春节', '清明节', '劳动节', '国庆节'],
  ],
  medical: [
    ['发烧', '咳嗽', '头疼', '肚子疼', '牙疼', '嗓子疼', '头晕', '恶心', '呕吐', '腹泻', '便秘', '失眠', '过敏', '皮疹', '瘙痒', '肿胀', '出血', '骨折', '扭伤', '烫伤', '高血压', '糖尿病', '心脏病', '感冒', '流感'],
    ['内科', '外科', '儿科', '妇产科', '眼科', '耳鼻喉科', '口腔科', '皮肤科', '中医科', '骨科', '神经科', '精神科', '急诊科', '放射科', '检验科', '体检中心', '门诊部', '住院部', '手术室', '药房', '挂号处', '收费处', '护士站', '病房', '诊室'],
    ['感冒药', '退烧药', '止痛药', '消炎药', '抗生素', '维生素', '降压药', '降糖药', '胃药', '止泻药', '抗过敏药', '止咳药', '润喉糖', '创可贴', '碘伏', '酒精', '棉签', '纱布', '绷带', '体温计', '血压计', '血糖仪', '眼药水', '药膏', '中药'],
    ['抽血', '验尿', 'B超', 'CT', 'X光', '核磁共振', '心电图', '胃镜', '肠镜', '体检', '量血压', '测体温', '打针', '输液', '手术', '化疗', '放疗', '复查', '复诊', '转诊', '化验单', '检查报告', '诊断结果', '处方单', '病历本'],
    ['头', '头发', '眉毛', '眼睛', '鼻子', '嘴巴', '牙齿', '舌头', '耳朵', '脸', '脖子', '肩膀', '手臂', '手', '手指', '指甲', '胸部', '背部', '腰部', '肚子', '腿', '膝盖', '脚', '脚趾', '皮肤'],
    ['挂号', '排队', '叫号', '就诊', '问诊', '检查', '缴费', '取药', '住院', '出院', '预约', '转诊', '急诊', '抢救', '手术', '陪护', '探视', '报销', '医保', '保险', '转院', '请假条', '诊断证明', '病假单', '健康证'],
  ],
  business: [
    ['简历', '求职信', '面试', '笔试', '录用', '入职', '试用期', '转正', '辞职', '离职', '学历', '专业', '工作经验', '技能', '证书', '作品集', '薪资', '福利', '社保', '公积金', '岗位', '部门', '公司', '行业', '职业规划'],
    ['上班', '下班', '加班', '请假', '调休', '打卡', '签到', '出差', '报销', '汇报', '会议', '培训', '考核', '绩效', '晋升', '降职', '加薪', '年终奖', '团建', '年会', '邮件', '电话', '文件', '档案', '保密'],
    ['议程', '议题', '讨论', '决议', '纪要', '发言', '提案', '表决', '反对', '赞成', '方案', '计划', '目标', '进度', '截止日期', '优先级', '里程碑', '风险', '问题', '解决', '总结', '复盘', '反馈', '改进', '跟进'],
    ['客户', '合作', '谈判', '报价', '合同', '订单', '发货', '收款', '售后', '投诉', '市场', '竞争', '品牌', '营销', '推广', '销售', '业绩', '指标', '渠道', '人脉', '投标', '战略', '股权', '投资', '融资'],
    ['帮忙', '请教', '打扰', '感谢', '道歉', '协调', '沟通', '冲突', '误会', '解释', '分享', '协作', '团队', '信任', '尊重', '理解', '包容', '支持', '鼓励', '批评', '申请', '交接', '汇报', '例会', '聚餐'],
  ],
  education: [
    ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治', '音乐', '美术', '体育', '信息技术', '综合实践', '品德', '科学', '社会', '自然', '劳动', '书法', '代数', '几何', '微积分', '编程', '物理实验'],
    ['小学', '中学', '高中', '大学', '学院', '班级', '年级', '学期', '学年', '开学', '放假', '毕业', '入学', '转学', '退学', '休学', '复学', '升学', '留学', '考研', '校服', '校徽', '校训', '校规', '学生证'],
    ['上课', '下课', '起立', '坐下', '提问', '回答', '朗读', '背诵', '默写', '听写', '黑板', '粉笔', '课本', '练习册', '作业本', '考试', '测验', '分数', '及格', '不及格', '交作业', '批改', '讲评', '预习', '复习'],
    ['高考', '中考', '月考', '期中', '期末', '模拟', '补考', '重修', '绩点', '学分', '录取', '分数线', '志愿', '奖学金', '助学金', '贷款', '保送', '自主', '考研', '考公', '考证', '托福', '雅思', '考级', '竞赛'],
    ['借书', '还书', '阅览', '自习', '书架', '图书证', '逾期', '罚款', '续借', '预约', '杂志', '报纸', '期刊', '电子书', '数据库', '文献', '论文', '资料', '复印', '打印', '安静', '占座', '检索', '阅览室', '闭馆'],
  ],
  legal: [
    ['法律', '宪法', '刑法', '民法', '商法', '经济法', '行政法', '诉讼法', '劳动法', '婚姻法', '继承法', '物权法', '合同法', '侵权', '知识产权', '法条', '司法', '解释', '案例', '判例', '法规', '条例', '规章', '法治', '权益'],
    ['起诉', '应诉', '管辖', '受理', '立案', '开庭', '审理', '判决', '裁定', '调解', '和解', '撤诉', '上诉', '申诉', '再审', '抗诉', '执行', '查封', '扣押', '冻结', '拍卖', '原告', '被告', '证人', '证据'],
    ['签订', '解除', '违约', '赔偿', '违约金', '定金', '订金', '押金', '保证金', '条款', '附件', '补充', '保密', '竞业', '责任', '不可抗力', '免责', '效力', '无效', '撤销', '劳动', '租赁', '买卖', '借款', '赠与'],
    ['权利', '义务', '责任', '利益', '损害', '侵权', '补偿', '救济', '申诉', '控告', '检举', '举报', '信访', '援助', '咨询', '律师函', '意见书', '顾问', '正当防卫', '紧急避险', '时效', '追诉', '公平', '正义', '自由'],
    ['调解', '仲裁', '裁决', '仲裁员', '调解书', '仲裁协议', '终局', '撤销', '人民调解', '行政调解', '司法调解', '民间调解', '和解协议', '自愿', '合法', '仲裁委', '规则', '申请', '答辩', '仲裁庭', '合议', '独任', '开庭', '书面', '裁决书'],
  ],
};

const translationMap: Record<string, string> = {
  爷爷: 'Grandfather', 奶奶: 'Grandmother', 爸爸: 'Father', 妈妈: 'Mother', 哥哥: 'Older Brother',
  姐姐: 'Older Sister', 弟弟: 'Younger Brother', 妹妹: 'Younger Sister', 丈夫: 'Husband', 妻子: 'Wife',
  朋友: 'Friend', 邻居: 'Neighbor', 同事: 'Colleague', 老板: 'Boss', 医生: 'Doctor',
  护士: 'Nurse', 老师: 'Teacher', 学生: 'Student', 警察: 'Police', 司机: 'Driver',
  米饭: 'Rice', 面条: 'Noodles', 饺子: 'Dumplings', 咖啡: 'Coffee', 牛奶: 'Milk',
  水果: 'Fruit', 蔬菜: 'Vegetables', 肉: 'Meat', 鱼: 'Fish', 鸡蛋: 'Eggs',
  衣服: 'Clothes', 裤子: 'Pants', 鞋子: 'Shoes', 帽子: 'Hat', 眼镜: 'Glasses',
  你好: 'Hello', 谢谢: 'Thank you', 对不起: 'Sorry', 再见: 'Goodbye', 请: 'Please',
  发烧: 'Fever', 咳嗽: 'Cough', 头疼: 'Headache', 感冒: 'Cold', 医院: 'Hospital',
  吃饭: 'Eat', 喝水: 'Drink water', 买: 'Buy', 卖: 'Sell', 钱: 'Money',
  爱: 'Love', 开心: 'Happy', 难过: 'Sad', 帮助: 'Help', 学习: 'Study',
  工作: 'Work', 时间: 'Time', 今天: 'Today', 明天: 'Tomorrow', 昨天: 'Yesterday',
};

const exampleTemplates = [
  '场景对话：A：「请问这个用手语怎么说？」B：「跟我一起做，这个手势表示{word}。」',
  '在日常生活中经常会用到「{word}」，学会这个手语能让沟通更顺畅。',
  '当你想表达「{word}」的意思时，记得手型要准确，动作要清晰。',
  '练习建议：对着镜子反复做「{word}」的手势50遍，形成肌肉记忆。',
  '易错提示：「{word}」的手语容易和另一个相似手势混淆，注意区分手型位置。',
  '学习小技巧：做「{word}」手势时配合相应的面部表情，表达会更自然生动。',
  '这个「{word}」手语是全国通用的标准表达，可以放心使用。',
];

const difficultyMap: Record<string, 'easy' | 'medium' | 'hard'> = {
  '称谓': 'easy', '饮食': 'easy', '时间': 'easy', '天气': 'easy',
  '服饰': 'easy', '居住': 'medium', '出行': 'medium', '娱乐': 'medium',
  '症状': 'medium', '科室': 'medium', '就医流程': 'medium', '身体部位': 'easy',
  '药品': 'hard', '检查': 'hard',
  '求职面试': 'medium', '办公用语': 'medium', '同事相处': 'easy',
  '会议发言': 'hard', '商务谈判': 'hard',
  '学科知识': 'medium', '校园生活': 'easy', '课堂用语': 'easy',
  '考试升学': 'hard', '图书馆': 'easy',
  '法律术语': 'hard', '诉讼流程': 'hard', '合同协议': 'hard',
  '权益保护': 'medium', '调解仲裁': 'hard',
};

export const mockWords: Word[] = (() => {
  const words: Word[] = [];
  let id = 1;
  Object.entries(vocabCategories).forEach(([key, info]) => {
    const lists = wordBank[key];
    info.subs.forEach((sub, subIdx) => {
      const wordList = lists[subIdx] || [];
      wordList.forEach((w) => {
        const difficulty = difficultyMap[sub] || 'medium';
        const template = exampleTemplates[id % exampleTemplates.length];
        words.push({
          id: `w${String(id).padStart(4, '0')}`,
          word: w,
          translation: translationMap[w] || w,
          pronunciation: '',
          videoUrl: '',
          imageUrl: img(`手语词汇 ${w} 标准手势演示 清晰教学图`, 'landscape_4_3'),
          category: info.cat,
          difficulty,
          example: template.replace(/\{word\}/g, w),
          isFavorite: false,
        });
        id++;
      });
    });
  });
  return words;
})();

export const mockDictionary: Dictionary = {
  groups: [
    {
      id: 'g001',
      name: '医院常用',
      wordIds: mockWords.filter((w) => w.category === '医疗就诊').slice(0, 15).map((w) => w.id),
      createdAt: '2025-10-10T14:30:00Z',
    },
    {
      id: 'g002',
      name: '购物必备',
      wordIds: mockWords.filter((w) => w.category === '日常生活' && (w.word === '衣服' || w.word === '钱' || w.word === '买' || w.word === '卖' || w.word === '鞋子' || w.word === '帽子' || w.word === '贵')).map((w) => w.id),
      createdAt: '2025-10-18T19:20:00Z',
    },
    {
      id: 'g003',
      name: '面试高频',
      wordIds: mockWords.filter((w) => w.category === '职场沟通').slice(0, 12).map((w) => w.id),
      createdAt: '2025-11-05T10:15:00Z',
    },
  ],
  totalWords: mockWords.length,
};

const authors = [
  { id: 'a001', name: '手语小美', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  { id: 'a002', name: '阿飞的日常', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { id: 'a003', name: '翻译志愿者小周', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
  { id: 'a004', name: '听障女孩阿青', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face' },
  { id: 'a005', name: '手语老师老王', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
  { id: 'a006', name: '阳光少年小杰', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
  { id: 'a007', name: '爱画画的小丽', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
  { id: 'a008', name: '旅行达人阿坤', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face' },
];

const postsData = [
  { channel: 'share' as const, title: '今天教大家一个超实用的购物手语，再也不怕买东西被坑啦！', content: '大家好！今天给大家分享几个购物时最常用的手语：多少钱、便宜点、太贵了、我再看看...这些都是我亲测在菜市场和商场都能用的实用表达！视频里有慢动作演示，新手也能轻松学会。记得点赞收藏哦～', likes: 1256, comments: 42, views: 15680, days: 1 },
  { channel: 'help' as const, title: '求助！下周要去医院做检查，这些医疗术语手语怎么做？', content: '大家好，我下周要去医院做体检，有几个专业术语不太确定手语怎么表达：血常规、心电图、B超、空腹。有没有懂的朋友能教教我？或者有相关的课程推荐吗？谢谢大家了！', likes: 234, comments: 56, views: 3420, days: 2 },
  { channel: 'discussion' as const, title: '作为一个听障人士，我是如何在职场中逆袭的', content: '从被歧视到成为部门主管，这5年我走了很多弯路。今天想和大家分享我的经历：1. 练好职场手语是基础 2. 主动沟通比什么都重要 3. 能力永远是第一位的。希望我的故事能给正在迷茫的朋友一些鼓励...', likes: 3580, comments: 128, views: 42560, days: 3 },
  { channel: 'share' as const, title: '周末和朋友一起去爬山，手语沟通无障碍的一天！', content: '约了几个听障朋友一起去爬香山，全程手语交流毫无压力！分享一些旅行中实用的手语：爬山、累了、休息、喝水、拍照、风景好美...下次准备组织更多朋友一起去！', likes: 892, comments: 35, views: 12340, days: 4, images: 3 },
  { channel: 'share' as const, title: '挑战30天学会手语基础，第15天打卡！进度汇报', content: '第15天打卡！目前已经掌握了：日常问候、数字1-100、家庭成员、常见食物。今天开始学习时间表达。发现每天坚持30分钟真的很有效，有一起打卡的小伙伴吗？评论区互相鼓励！', likes: 567, comments: 89, views: 7890, days: 5 },
  { channel: 'discussion' as const, title: '家长必看！如何与听障孩子有效沟通，这些技巧太重要了', content: '作为特殊教育学校的老师，我想给家长们一些建议：1. 学手语不是妥协，是给孩子另一种沟通方式 2. 不要用手势代替手语，要学规范的中国手语 3. 耐心比什么都重要。欢迎大家在评论区交流...', likes: 2890, comments: 156, views: 38900, days: 6 },
  { channel: 'news' as const, title: '好消息！国家残联发布新版手语翻译资格认证通知', content: '最新政策分享：2026年起全国统一手语翻译资格证考试，考试分为笔试和实操两部分，通过后可获得国家级认证。这对手语行业是重大利好！详细内容我整理在评论区了。', likes: 1520, comments: 67, views: 25600, days: 7 },
  { channel: 'share' as const, title: '5个超实用的餐厅点单手语，聋哑人独立点餐不是梦', content: '以前去餐厅总是需要朋友陪同，现在学会这5个手语就可以自己点餐了！1.我要菜单 2.这个多少钱 3.不要辣 4.打包 5.买单。大家还有什么想补充的吗？', likes: 2130, comments: 78, views: 28900, days: 8 },
  { channel: 'share' as const, title: '我的手语学习笔记分享，从零基础到日常沟通用了3个月', content: '分享我的学习方法：1. 每天看手语新闻30分钟磨手感 2. 用Anki卡片背词汇 3. 每周参加线下手语角练习 4. 不要怕犯错，大胆用。希望对新学的朋友有帮助！', likes: 1780, comments: 92, views: 21300, days: 9, images: 5 },
  { channel: 'share' as const, title: '参加手语志愿者活动的感受，帮助别人真的很快乐！', content: '周末去社区做了手语志愿者，帮几位听障老人和社区工作人员沟通。看到老人们脸上的笑容，真的觉得一切都值得！呼吁更多健听朋友学一点基础手语，有时候一个简单的手势就能温暖一个人。', likes: 4250, comments: 145, views: 52800, days: 10 },
  { channel: 'discussion' as const, title: '新手必看：学手语最容易犯的10个错误，你中了几个？', content: '整理了新手最容易踩的坑：1. 手型不准确 2. 动作太快看不清楚 3. 没有配合表情 4. 照搬方言手语...欢迎大家在评论区补充你踩过的坑！', likes: 1890, comments: 203, views: 24500, days: 11 },
  { channel: 'share' as const, title: '用手语唱首歌给大家听，《隐形的翅膀》手语版', content: '练了好久的手语歌，终于能连贯地做下来了！虽然还有很多不完美的地方，但想分享给大家。每一个手势都倾注了感情，希望能给同样在努力的你一些力量～', likes: 3670, comments: 167, views: 48900, days: 12 },
  { channel: 'share' as const, title: '春节回家用手语给爸妈拜年，他们感动得哭了', content: '今年春节是我学会手语后第一次回家，用手语给爸妈拜年说「新年快乐，我爱你们」。爸妈虽然看不懂，但还是抱着我哭了...分享这些家庭温馨的瞬间，希望大家都能多陪陪家人。', likes: 5890, comments: 245, views: 67800, days: 14, images: 4 },
  { channel: 'help' as const, title: '面试时如何用手语做自我介绍？这个模板超好用！', content: '下周有个重要面试，想请教大家手语自我介绍的规范表达。目前想到的：名字、学历、工作经验、技能。有没有什么注意事项？或者有没有推荐的面试手语课程？谢谢！', likes: 456, comments: 73, views: 5670, days: 16 },
  { channel: 'discussion' as const, title: '在咖啡馆遇到一位同样学手语的小姐姐，缘分太奇妙了', content: '今天在咖啡馆用手语和服务员点单，旁边一位小姐姐突然用手语和我打招呼！原来她也在学手语，我们聊了一个多小时，还约了下周一起去手语角。这种偶遇真的太暖心了～', likes: 2340, comments: 87, views: 31200, days: 18 },
];

export const mockPosts: Post[] = postsData.map((p, i) => {
  const author = authors[i % authors.length];
  const baseTime = Date.now() - p.days * 86400000 - Math.floor(Math.random() * 86400000);
  return {
    id: `p${String(i + 1).padStart(3, '0')}`,
    authorId: author.id,
    authorName: author.name,
    authorAvatar: author.avatar,
    channel: p.channel,
    title: p.title,
    content: p.content,
    images: p.images ? Array.from({ length: p.images }, (_, j) => img(`社区帖子配图 ${p.title.slice(0, 8)} ${j + 1}`, 'square')) : undefined,
    likes: p.likes,
    comments: p.comments,
    views: p.views,
    isLiked: i % 4 === 1,
    createdAt: new Date(baseTime).toISOString(),
  };
});

const commentTexts = [
  '太棒了！这个手势我之前一直做错了，感谢纠正！',
  '终于找到这么详细的教程，收藏收藏～',
  '想问一下，这个手势和另一个很像的怎么区分呀？',
  '作为健听人在学手语，你的内容帮了我大忙！',
  '希望多多更新这种实用内容，支持你！',
  '今天练习了50遍，终于做对了，超开心！',
  '你的手语动作真的很标准，是专业老师吗？',
  '我也是听障人士，真的感同身受，加油！',
  '感谢分享，已经推荐给我的朋友们了！',
  '有字幕真的太友好了，能同时看和理解～',
  '这个知识点太重要了，以前去医院真的很尴尬',
  '请问有没有更慢一点的动作分解视频呀？',
  '跟着你学了一个月，进步很大，谢谢你！',
  '这个系列什么时候出下一期呀？催更！',
  '第一次评论，就是想告诉你你真的很棒！',
  '推荐大家配合字幕一起看，学习效率更高',
  '如果能配上文字说明就更好了，不过已经很赞！',
  '妈妈也是听障人士，我要把这个分享给她',
  '志愿者路过，给你点赞，一起加油！',
  '这个表情配合手势的技巧太实用了！',
  '每次都来打卡学习，已经成习惯了哈哈',
  '请问这个手势在不同地区有区别吗？',
  '真的太感谢了，找这个教程好久了！',
  '跟着做了一遍，手有点酸，但很有成就感',
  '希望有更多人能关注到手语学习的重要性',
  '视频质量越来越好了，继续加油！',
  '请问有没有相关的练习APP推荐？',
  '今天用学到的手语和别人沟通，成功了！',
  '这个手势的动作要领总结得很到位',
  '从你的第一个帖子追到现在，进步肉眼可见！',
  '准备做一个手语学习笔记，你的内容是重点',
  '感谢平台有这么好的手语内容！',
  '你的经历给了我很大的鼓励，谢谢你！',
  '完全同意你的观点，主动沟通真的很重要！',
  '这个政策太好了，终于有官方认证了！',
  '同求面试手语技巧，下周也要面试了！',
];

const commentAuthors = [
  { name: '热心网友小张', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face' },
  { name: '手语初学者', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face' },
  { name: '默默学习的人', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=face' },
  { name: '加油打工人', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face' },
  { name: '想当翻译的猫', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&h=80&fit=crop&crop=face' },
  { name: '健听学习中', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=80&h=80&fit=crop&crop=face' },
  { name: '学习使我快乐', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=80&h=80&fit=crop&crop=face' },
];

export const mockComments: Comment[] = (() => {
  const result: Comment[] = [];
  let cid = 1;
  mockPosts.forEach((post, pi) => {
    const numComments = 2 + (pi % 5);
    for (let i = 0; i < numComments; i++) {
      const author = commentAuthors[(pi * 3 + i) % commentAuthors.length];
      const postTime = new Date(post.createdAt).getTime();
      result.push({
        id: `cm${String(cid++).padStart(5, '0')}`,
        postId: post.id,
        authorId: `usr_${pi * 7 + i}`,
        authorName: author.name,
        authorAvatar: author.avatar,
        content: commentTexts[(pi * 5 + i * 3) % commentTexts.length],
        likes: Math.floor(Math.random() * 50),
        createdAt: new Date(postTime + (i + 1) * 3600000 * (1 + Math.random() * 5)).toISOString(),
        replyTo: i === numComments - 1 && pi % 3 === 0 ? result[result.length - 1]?.authorName : undefined,
      });
    }
  });
  return result;
})();

const orderData = [
  { title: '医院就诊陪同翻译', type: 'live' as const, urgency: 'urgent' as const, status: 'completed' as const, days: 10, budget: 300, rating: 5, review: '翻译非常专业，全程耐心细致，帮我和医生沟通得非常清楚，下次还会预约！' },
  { title: '法院出庭手语翻译', type: 'live' as const, urgency: 'vip' as const, status: 'completed' as const, days: 5, budget: 800, rating: 5, review: '法律术语翻译准确，在法庭上帮我充分表达了意见，非常感谢！' },
  { title: '家长会沟通翻译', type: 'live' as const, urgency: 'normal' as const, status: 'accepted' as const, days: 2, budget: 200 },
  { title: '商务洽谈会议翻译', type: 'live' as const, urgency: 'urgent' as const, status: 'pending' as const, days: 7, budget: 1200 },
  { title: '产检陪同翻译', type: 'live' as const, urgency: 'normal' as const, status: 'accepted' as const, days: 0, budget: 250 },
  { title: '银行业务办理协助', type: 'text' as const, urgency: 'normal' as const, status: 'cancelled' as const, days: 3, budget: 100 },
];

const translators = [
  { id: 'trans001', name: '周慧敏', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face' },
  { id: 'trans002', name: '李明辉', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face' },
  { id: 'trans003', name: '赵晓燕', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face' },
];

export const mockOrders: TranslationOrder[] = orderData.map((o, i) => {
  const hasTranslator = o.status === 'accepted' || o.status === 'completed';
  const translator = hasTranslator ? translators[i % translators.length] : undefined;
  const createDate = new Date(Date.now() - (o.days + 2) * 86400000);
  const deadline = new Date(Date.now() + o.days * 86400000);
  return {
    id: `t${String(i + 1).padStart(3, '0')}`,
    title: o.title,
    description: `${o.title}。需要有相关经验的专业手语翻译，要求熟悉相关领域术语，准时到场，服务态度好。如有相关资质证书请在接单时备注。`,
    type: o.type,
    source: '中文',
    targetLanguage: i % 2 === 0 ? 'sign' : 'chinese',
    urgency: o.urgency,
    budget: o.budget,
    status: o.status,
    clientId: mockUser.id,
    clientName: mockUser.name,
    clientAvatar: mockUser.avatar,
    translatorId: translator?.id,
    translatorName: translator?.name,
    translatorAvatar: translator?.avatar,
    deadline: deadline.toISOString(),
    rating: o.rating,
    review: o.review,
    createdAt: createDate.toISOString(),
  };
});

const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
export const mockWeeklyTrend: WeeklyTrendPoint[] = dayNames.map((day, i) => ({
  day,
  studyMinutes: [45, 62, 38, 75, 90, 120, 88][i],
  wordsLearned: [5, 8, 4, 12, 15, 20, 12][i],
}));

export const mockCategoryRadar: CategoryRadarPoint[] = [
  { category: '日常生活', value: 78, fullMark: 100 },
  { category: '医疗就诊', value: 52, fullMark: 100 },
  { category: '职场沟通', value: 35, fullMark: 100 },
  { category: '教育学习', value: 60, fullMark: 100 },
  { category: '法律事务', value: 25, fullMark: 100 },
];
