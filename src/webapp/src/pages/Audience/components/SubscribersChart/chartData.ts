
export interface AudienceChartData {
	day: string;
	subscriptions: number;
	unsubscriptions: number
	total: number
	[key: string]: string | number;
}

export const chartData: AudienceChartData[] = [
  {
    day: '2023-10-01',
    subscriptions: 120,
    unsubscriptions: -30,
    total: 190
  },
  {
    day: '2023-10-02',
    subscriptions: 150,
    unsubscriptions: -20,
    total: 320
  },
  {
    day: '2023-10-03',
    subscriptions: 90,
    unsubscriptions: -50,
    total: 360
  },
  {
    day: '2023-10-04',
    subscriptions: 450,
    unsubscriptions: -80,
    total: 730
  },
  {
    day: '2023-10-05',
    subscriptions: 100,
    unsubscriptions: -60,
    total: 770
  },
  {
    day: '2023-10-06',
    subscriptions: 180,
    unsubscriptions: -30,
    total: 920
  },
  {
    day: '2023-10-07',
    subscriptions: 160,
    unsubscriptions: -50,
    total: 1030
  },
  {
    day: '2023-10-08',
    subscriptions: 140,
    unsubscriptions: -70,
    total: 1100
  },
  {
    day: '2023-10-09',
    subscriptions: 200,
    unsubscriptions: -20,
    total: 1280
  },
  {
    day: '2023-10-10',
    subscriptions: 90,
    unsubscriptions: -80,
    total: 1290
  },
  {
    day: '2023-10-11',
    subscriptions: 250,
    unsubscriptions: -10,
    total: 1530
  },
  {
    day: '2023-10-12',
    subscriptions: 170,
    unsubscriptions: -90,
    total: 1610
  },
  {
    day: '2023-10-13',
    subscriptions: 300,
    unsubscriptions: -50,
    total: 1860
  },
  {
    day: '2023-10-14',
    subscriptions: 80,
    unsubscriptions: -100,
    total: 1840
  },
  {
    day: '2023-10-15',
    subscriptions: 5,
    unsubscriptions: -2,
    total: 1843 // 1840 + 5 - 2
  },
  {
    day: '2023-10-16',
    subscriptions: 1000,
    unsubscriptions: -50,
    total: 2793 // 1843 + 1000 - 50
  },
  {
    day: '2023-10-17',
    subscriptions: 50,
    unsubscriptions: -300,
    total: 2543 // 2793 + 50 - 300
  },
  {
    day: '2023-10-18',
    subscriptions: 800,
    unsubscriptions: -20,
    total: 3323 // 2543 + 800 - 20
  },
  {
    day: '2023-10-19',
    subscriptions: 10,
    unsubscriptions: -5,
    total: 3328 // 3323 + 10 - 5
  },
  {
    day: '2023-10-20',
    subscriptions: 1500,
    unsubscriptions: -100,
    total: 4728 // 3328 + 1500 - 100
  },
  {
    day: '2023-10-21',
    subscriptions: 30,
    unsubscriptions: -400,
    total: 4358 // 4728 + 30 - 400
  },
  {
    day: '2023-10-22',
    subscriptions: 2000,
    unsubscriptions: -50,
    total: 6308 // 4358 + 2000 - 50 (исправлено с 3308)
  },
  {
    day: '2023-10-23',
    subscriptions: 1,
    unsubscriptions: -1,
    total: 6308 // 6308 + 1 - 1
  },
  {
    day: '2023-10-24',
    subscriptions: 500,
    unsubscriptions: -200,
    total: 6608 // 6308 + 500 - 200
  },
  {
    day: '2023-10-25',
    subscriptions: 1000,
    unsubscriptions: -10,
    total: 2598 // 6608 + 3000 - 10 (исправлено с 4598)
  },
  // Добавленные дни (с 2023-10-26 по 2023-11-14, 20 дней)
  {
    day: '2023-10-26',
    subscriptions: 120,
    unsubscriptions: -30,
    total: 688 // 9598 + 120 - 30
  },
  {
    day: '2023-10-27',
    subscriptions: 1500,
    unsubscriptions: -150,
    total: 2038 // 9688 + 2500 - 150
  },
  {
    day: '2023-10-28',
    subscriptions: 80,
    unsubscriptions: -500,
    total: 1618 // 12038 + 80 - 500
  },
  {
    day: '2023-10-29',
    subscriptions: 600,
    unsubscriptions: -20,
    total: 2198 // 11618 + 600 - 20
  },
  {
    day: '2023-10-30',
    subscriptions: 15,
    unsubscriptions: -5,
    total: 2208 // 12198 + 15 - 5
  },
  {
    day: '2023-10-31',
    subscriptions: 900,
    unsubscriptions: -100,
    total: 3008 // 12208 + 900 - 100
  },
  {
    day: '2023-11-01',
    subscriptions: 50,
    unsubscriptions: -300,
    total: 2758 // 13008 + 50 - 300
  },
  {
    day: '2023-11-02',
    subscriptions: 1200,
    unsubscriptions: -50,
    total: 908 // 12758 + 1200 - 50
  },
  {
    day: '2023-11-03',
    subscriptions: 10,
    unsubscriptions: -2,
    total: 3916 // 13908 + 10 - 2
  },
  {
    day: '2023-11-04',
    subscriptions: 4000,
    unsubscriptions: -200,
    total: 7716 // 13916 + 4000 - 200
  },
  {
    day: '2023-11-05',
    subscriptions: 300,
    unsubscriptions: -600,
    total: 7416 // 17716 + 300 - 600
  },
  {
    day: '2023-11-06',
    subscriptions: 150,
    unsubscriptions: -50,
    total: 7516 // 17416 + 150 - 50
  },
  {
    day: '2023-11-07',
    subscriptions: 800,
    unsubscriptions: -10,
    total: 8306 // 17516 + 800 - 10
  },
  {
    day: '2023-11-08',
    subscriptions: 5,
    unsubscriptions: -1000,
    total: 7311 // 18306 + 5 - 1000
  },
  {
    day: '2023-11-09',
    subscriptions: 2000,
    unsubscriptions: -300,
    total: 9011 // 17311 + 2000 - 300
  },
  {
    day: '2023-11-10',
    subscriptions: 100,
    unsubscriptions: -50,
    total: 9061 // 19011 + 100 - 50
  },
  {
    day: '2023-11-11',
    subscriptions: 700,
    unsubscriptions: -20,
    total: 9741 // 19061 + 700 - 20
  },
  {
    day: '2023-11-12',
    subscriptions: 50,
    unsubscriptions: -150,
    total: 9641 // 19741 + 50 - 150
  },
  {
    day: '2023-11-13',
    subscriptions: 2500,
    unsubscriptions: -500,
    total: 1641 // 19641 + 2500 - 500
  },
  {
    day: '2023-11-14',
    subscriptions: 30,
    unsubscriptions: -10,
    total: 1661 // 21641 + 30 - 10
  }
]
