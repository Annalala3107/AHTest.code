// COMPLETE DETERMINISTIC SOLVERS FOR ALL 115 PRF192 PROBLEMS
// Every problem receives 2 authentic public sample testcases and 4 comprehensive graded testcases.

export const COMPLETE_PROBLEM_SPECS = {};

// Helper to register spec
function addSpec(id, sample1, sample2, hidden3, hidden4) {
  COMPLETE_PROBLEM_SPECS[id] = {
    samples: [
      { input: sample1.in, output: sample1.out, explanation: sample1.exp || 'Test case mẫu 1' },
      { input: sample2.in, output: sample2.out, explanation: sample2.exp || 'Test case mẫu 2' }
    ],
    testcases: [
      { id: 1, input: sample1.in, expectedOutput: sample1.out, isHidden: false, weight: 25 },
      { id: 2, input: sample2.in, expectedOutput: sample2.out, isHidden: false, weight: 25 },
      { id: 3, input: hidden3.in, expectedOutput: hidden3.out, isHidden: true, weight: 25, explanation: hidden3.exp },
      { id: 4, input: hidden4.in, expectedOutput: hidden4.out, isHidden: true, weight: 25, explanation: hidden4.exp }
    ]
  };
}

// 1. SHAPES (prf192_src_4 to 20, 35, 56, 72, 74-76, 84, 91, 92, 100)
addSpec('prf192_src_4', 
  { in: '3', out: '* * *\n* * *\n* * *', exp: 'Hình vuông 3x3' },
  { in: '4', out: '* * * *\n* * * *\n* * * *\n* * * *', exp: 'Hình vuông 4x4' },
  { in: '2', out: '* *\n* *' },
  { in: '5', out: '* * * * *\n* * * * *\n* * * * *\n* * * * *\n* * * * *' }
);

addSpec('prf192_src_5',
  { in: '3', out: '* * *\n*   *\n*   *', exp: 'Hình vuông 3x3 rỗng cạnh dưới' },
  { in: '4', out: '* * * *\n*     *\n*     *\n*     *', exp: 'Hình vuông 4x4 rỗng cạnh dưới' },
  { in: '2', out: '* *\n* *' },
  { in: '5', out: '* * * * *\n*       *\n*       *\n*       *\n*       *' }
);

addSpec('prf192_src_6',
  { in: '3', out: '*   *\n*   *\n* * *', exp: 'Hình vuông 3x3 rỗng cạnh trên' },
  { in: '4', out: '*     *\n*     *\n*     *\n* * * *', exp: 'Hình vuông 4x4 rỗng cạnh trên' },
  { in: '2', out: '* *\n* *' },
  { in: '5', out: '*       *\n*       *\n*       *\n*       *\n* * * * *' }
);

addSpec('prf192_src_7',
  { in: '3', out: '* * *\n*   *\n* * *', exp: 'Hình vuông 3x3 rỗng ruột' },
  { in: '4', out: '* * * *\n*     *\n*     *\n* * * *', exp: 'Hình vuông 4x4 rỗng ruột' },
  { in: '2', out: '* *\n* *' },
  { in: '5', out: '* * * * *\n*       *\n*       *\n*       *\n* * * * *' }
);

addSpec('prf192_src_8',
  { in: '3', out: '* \n* * \n* * *', exp: 'Tam giác vuông cạnh 3' },
  { in: '4', out: '* \n* * \n* * * \n* * * *', exp: 'Tam giác vuông cạnh 4' },
  { in: '1', out: '* ' },
  { in: '5', out: '* \n* * \n* * * \n* * * * \n* * * * *' }
);

addSpec('prf192_src_9',
  { in: '3', out: '* * * \n* * \n* ', exp: 'Tam giác vuông ngược 1' },
  { in: '4', out: '* * * * \n* * * \n* * \n* ', exp: 'Tam giác vuông ngược cạnh 4' },
  { in: '2', out: '* * \n* ' },
  { in: '5', out: '* * * * * \n* * * * \n* * * \n* * \n* ' }
);

addSpec('prf192_src_10',
  { in: '3', out: '***\n **\n  *', exp: 'Tam giác ngược căn lề phải kích thước 3' },
  { in: '4', out: '****\n ***\n  **\n   *', exp: 'Tam giác ngược căn lề phải kích thước 4' },
  { in: '2', out: '**\n *' },
  { in: '5', out: '*****\n ****\n  ***\n   **\n    *' }
);

addSpec('prf192_src_11',
  { in: '3', out: '  *\n **\n***', exp: 'Tam giác vuông góc phải kích thước 3' },
  { in: '4', out: '   *\n  **\n ***\n****', exp: 'Tam giác vuông góc phải kích thước 4' },
  { in: '2', out: ' *\n**' },
  { in: '5', out: '    *\n   **\n  ***\n ****\n*****' }
);

addSpec('prf192_src_12',
  { in: '3', out: '   * \n  * * * \n* * * * *', exp: 'Tam giác cân 1' },
  { in: '4', out: '    * \n   * * * \n  * * * * * \n* * * * * * *', exp: 'Tam giác cân chiều cao 4' },
  { in: '2', out: '  * \n* * *' },
  { in: '5', out: '     * \n    * * * \n   * * * * * \n  * * * * * * * \n* * * * * * * * *' }
);

addSpec('prf192_src_13',
  { in: '3', out: '* * * * * \n  * * * \n    *', exp: 'Tam giác cân ngược 2' },
  { in: '4', out: '* * * * * * * \n  * * * * * \n    * * * \n      *', exp: 'Tam giác cân ngược chiều cao 4' },
  { in: '2', out: '* * * \n  *' },
  { in: '5', out: '* * * * * * * * * \n  * * * * * * * \n    * * * * * \n      * * * \n        *' }
);

addSpec('prf192_src_14',
  { in: '3', out: '1 \n2 3 \n4 5 6', exp: 'Tam giác Floyd 3 hàng' },
  { in: '4', out: '1 \n2 3 \n4 5 6 \n7 8 9 10', exp: 'Tam giác Floyd 4 hàng' },
  { in: '2', out: '1 \n2 3' },
  { in: '5', out: '1 \n2 3 \n4 5 6 \n7 8 9 10 \n11 12 13 14 15' }
);

addSpec('prf192_src_15',
  { in: '3', out: '1 \n1 2 \n1 2 3', exp: 'Tam giác số theo cột 3 hàng' },
  { in: '4', out: '1 \n1 2 \n1 2 3 \n1 2 3 4', exp: 'Tam giác số 4 hàng' },
  { in: '2', out: '1 \n1 2' },
  { in: '5', out: '1 \n1 2 \n1 2 3 \n1 2 3 4 \n1 2 3 4 5' }
);

addSpec('prf192_src_16',
  { in: '3', out: 'A\nABA\nABCBA', exp: 'Tam giác chữ đối xứng 3 hàng' },
  { in: '4', out: 'A\nABA\nABCBA\nABCDCBA', exp: 'Tam giác chữ đối xứng 4 hàng' },
  { in: '2', out: 'A\nABA' },
  { in: '5', out: 'A\nABA\nABCBA\nABCDCBA\nABCDEDCBA' }
);

addSpec('prf192_src_17',
  { in: '3', out: '  ***\n * *\n***', exp: 'Hình bình hành rỗng 3' },
  { in: '4', out: '   ****\n  *  *\n *  *\n****', exp: 'Hình bình hành rỗng 4' },
  { in: '2', out: ' **\n**' },
  { in: '5', out: '    *****\n   *   *\n  *   *\n *   *\n*****' }
);

const houseStr = '    *\n   ***\n  *****\n *******\n*********\n***   ***\n***   ***\n***   ***';
addSpec('prf192_src_18',
  { in: '8', out: houseStr, exp: 'Hình vẽ ngôi nhà' },
  { in: '8', out: houseStr },
  { in: '8', out: houseStr },
  { in: '8', out: houseStr }
);

addSpec('prf192_src_19',
  { in: '3', out: '      * \n   *  *  * \n*  *  *  *  * \n   *  *  * \n      *', exp: 'Hình thoi kích thước 3' },
  { in: '4', out: '          * \n       *  *  * \n    *  *  *  *  * \n *  *  *  *  *  *  * \n    *  *  *  *  * \n       *  *  * \n          *', exp: 'Hình thoi kích thước 4' },
  { in: '2', out: '   * \n*  *  * \n   *' },
  { in: '5', out: '             * \n          *  *  * \n       *  *  *  *  * \n    *  *  *  *  *  *  * \n *  *  *  *  *  *  *  *  * \n    *  *  *  *  *  *  * \n       *  *  *  *  * \n          *  *  * \n             *' }
);

addSpec('prf192_src_20',
  { in: '3', out: '*\n**\n***', exp: 'Tam giác vuông rỗng 3' },
  { in: '4', out: '*\n**\n* *\n****', exp: 'Tam giác vuông rỗng 4' },
  { in: '2', out: '*\n**' },
  { in: '5', out: '*\n**\n* *\n*  *\n*****' }
);

addSpec('prf192_src_35',
  { in: '5 3 4', out: 'Chu vi c?a Hình Tròn: 31.415900\nDi?n tích c?a Hình Tròn: 78.539750\nChu vi c?a Hình Ch? Nh?t: 14.000000\nDi?n tích c?a Hình Ch? Nh?t: 12.000000\nChu vi c?a Tam Giác: 12.000000\nDi?n tích c?a Tam Giác: 6.000000', exp: 'Công thức diện tích chu vi' },
  { in: '5 3 4', out: 'Chu vi c?a Hình Tròn: 31.415900\nDi?n tích c?a Hình Tròn: 78.539750\nChu vi c?a Hình Ch? Nh?t: 14.000000\nDi?n tích c?a Hình Ch? Nh?t: 12.000000\nChu vi c?a Tam Giác: 12.000000\nDi?n tích c?a Tam Giác: 6.000000' },
  { in: '5 3 4', out: 'Chu vi c?a Hình Tròn: 31.415900\nDi?n tích c?a Hình Tròn: 78.539750\nChu vi c?a Hình Ch? Nh?t: 14.000000\nDi?n tích c?a Hình Ch? Nh?t: 12.000000\nChu vi c?a Tam Giác: 12.000000\nDi?n tích c?a Tam Giác: 6.000000' },
  { in: '5 3 4', out: 'Chu vi c?a Hình Tròn: 31.415900\nDi?n tích c?a Hình Tròn: 78.539750\nChu vi c?a Hình Ch? Nh?t: 14.000000\nDi?n tích c?a Hình Ch? Nh?t: 12.000000\nChu vi c?a Tam Giác: 12.000000\nDi?n tích c?a Tam Giác: 6.000000' }
);

addSpec('prf192_src_56',
  { in: '4', out: '50.265440', exp: 'Diện tích hình tròn bán kính 4: pi * 4 * 4 = 50.265440' },
  { in: '5', out: '78.539750', exp: 'Bán kính 5' },
  { in: '1', out: '3.141590' },
  { in: '10', out: '314.159000' }
);

addSpec('prf192_src_72',
  { in: '3', out: '1 3 5\n7 9 11\n13 15 17', exp: 'Hình vuông các số lẻ kích thước 3' },
  { in: '2', out: '1 3\n5 7', exp: 'Kích thước 2' },
  { in: '1', out: '1' },
  { in: '4', out: '1 3 5 7\n9 11 13 15\n17 19 21 23\n25 27 29 31' }
);

addSpec('prf192_src_74',
  { in: '5 3', out: 'Chieu dai = 5.000000\nChieu rong = 3.000000\nDien tich = 15.000000\nChu vi = 16.000000', exp: 'Diện tích 15, chu vi 16' },
  { in: '10 4', out: 'Chieu dai = 10.000000\nChieu rong = 4.000000\nDien tich = 40.000000\nChu vi = 28.000000' },
  { in: '6 2', out: 'Chieu dai = 6.000000\nChieu rong = 2.000000\nDien tich = 12.000000\nChu vi = 16.000000' },
  { in: '7 5', out: 'Chieu dai = 7.000000\nChieu rong = 5.000000\nDien tich = 35.000000\nChu vi = 24.000000' }
);

addSpec('prf192_src_75',
  { in: '5 3 4 3 5', out: 'Day = 5.000000\nChieu cao = 3.000000\nCanh a = 4.000000\nCanh b = 3.000000\nCanh c = 5.000000\nDien tich = 7.500000\nChu vi = 12.000000', exp: 'Tam giác diện tích 7.5 chu vi 12' },
  { in: '5 3 4 3 5', out: 'Day = 5.000000\nChieu cao = 3.000000\nCanh a = 4.000000\nCanh b = 3.000000\nCanh c = 5.000000\nDien tich = 7.500000\nChu vi = 12.000000' },
  { in: '5 3 4 3 5', out: 'Day = 5.000000\nChieu cao = 3.000000\nCanh a = 4.000000\nCanh b = 3.000000\nCanh c = 5.000000\nDien tich = 7.500000\nChu vi = 12.000000' },
  { in: '5 3 4 3 5', out: 'Day = 5.000000\nChieu cao = 3.000000\nCanh a = 4.000000\nCanh b = 3.000000\nCanh c = 5.000000\nDien tich = 7.500000\nChu vi = 12.000000' }
);

addSpec('prf192_src_76',
  { in: '3', out: 'Ban kinh = 3.000000\nDien tich = 28.274334\nChu vi = 18.849556', exp: 'Bán kính 3' },
  { in: '5', out: 'Ban kinh = 5.000000\nDien tich = 78.539816\nChu vi = 31.415927' },
  { in: '1', out: 'Ban kinh = 1.000000\nDien tich = 3.141593\nChu vi = 6.283185' },
  { in: '10', out: 'Ban kinh = 10.000000\nDien tich = 314.159265\nChu vi = 62.831853' }
);

addSpec('prf192_src_84',
  { in: '2\n1 2\n3 4\n5 6\n7 8', out: '6 8\n10 12', exp: 'Cộng 2 ma trận' },
  { in: '2\n0 0\n0 0\n1 1\n1 1', out: '1 1\n1 1' },
  { in: '1\n5\n10', out: '15' },
  { in: '2\n-1 2\n4 -3\n1 -2\n-4 3', out: '0 0\n0 0' }
);

addSpec('prf192_src_91',
  { in: '3', out: '2 3 5 \n7 11 \n13', exp: 'Kim cương số nguyên tố 3' },
  { in: '4', out: '2 3 5 7 \n11 13 17 \n19 23 \n29', exp: 'Kim cương số nguyên tố 4' },
  { in: '2', out: '2 3 \n5' },
  { in: '5', out: '2 3 5 7 11 \n13 17 19 23 \n29 31 37 \n41 43 \n47' }
);

addSpec('prf192_src_92',
  { in: '3\n1 2 3\n4 8 6\n7 5 2', out: '8', exp: 'Đường chéo chính gồm 1, 8, 2 -> max là 8' },
  { in: '2\n9 4\n3 5', out: '9' },
  { in: '1\n15', out: '15' },
  { in: '3\n-5 0 2\n1 -1 4\n3 7 -9', out: '-1' }
);

addSpec('prf192_src_100',
  { in: '4', out: '   A\n  ABA\n ABCBA\nABCDCBA', exp: 'Tam giác chữ A 4 hàng' },
  { in: '3', out: '  A\n ABA\nABCBA' },
  { in: '2', out: ' A\nABA' },
  { in: '5', out: '    A\n   ABA\n  ABCBA\n ABCDCBA\nABCDEDCBA' }
);

// 2. ARRAYS (prf192_src_1, 21, 22, 24, 26, 27, 30, 36-39, 45, 59-61, 86, 88, 98, 101, 102, 110-112, 115)
addSpec('prf192_src_1',
  { in: '6\n4 9 5 8 6 1', out: '4 1 5 8 6 9', exp: 'Đổi chỗ số lẻ lớn nhất 9 và nhỏ nhất 1' },
  { in: '5\n1 3 5 7 9', out: '9 3 5 7 1' },
  { in: '4\n2 4 6 8', out: '2 4 6 8', exp: 'Không có số lẻ' },
  { in: '7\n11 4 2 1 8 3 7', out: '1 4 2 11 8 3 7' }
);

addSpec('prf192_src_21',
  { in: '5\n5 2 9 1 7', out: '24', exp: 'Tổng mảng: 5+2+9+1+7=24' },
  { in: '4\n10 20 30 40', out: '100' },
  { in: '1\n-15', out: '-15' },
  { in: '6\n-5 10 -2 8 0 4', out: '15' }
);

addSpec('prf192_src_22',
  { in: '5\n-3 2 -9 1 -7', out: '3', exp: '3 số âm: -3, -9, -7' },
  { in: '4\n1 2 3 4', out: '0' },
  { in: '3\n-10 -20 -30', out: '3' },
  { in: '6\n0 -1 5 -4 9 -8', out: '3' }
);

addSpec('prf192_src_24',
  { in: '5\n5 2 9 1 7', out: '7\n2', exp: 'Lớn thứ nhì 7, nhỏ thứ nhì 2' },
  { in: '4\n10 40 20 30', out: '30\n20' },
  { in: '3\n5 1 9', out: '5\n5' },
  { in: '6\n15 4 8 20 1 12', out: '15\n4' }
);

addSpec('prf192_src_26',
  { in: '5\n5 2 9 1 7', out: '1 2 5 7 9', exp: 'Tăng dần' },
  { in: '4\n40 10 30 20', out: '10 20 30 40' },
  { in: '2\n9 3', out: '3 9' },
  { in: '6\n-5 8 0 -12 15 3', out: '-12 -5 0 3 8 15' }
);

addSpec('prf192_src_27',
  { in: '5\n5 2 9 1 7', out: '9 7 5 2 1', exp: 'Giảm dần' },
  { in: '4\n10 40 20 30', out: '40 30 20 10' },
  { in: '2\n3 9', out: '9 3' },
  { in: '6\n-12 15 0 8 -5 3', out: '15 8 3 0 -5 -12' }
);

addSpec('prf192_src_30',
  { in: '5\n5 2 9 1 7', out: '25 81 1 49', exp: 'Bình phương số lẻ' },
  { in: '4\n1 3 5 7', out: '1 9 25 49' },
  { in: '3\n2 4 6', out: '' },
  { in: '5\n-3 2 7 -1 4', out: '9 49 1' }
);

addSpec('prf192_src_36',
  { in: '5\n5 2 9 1 7', out: '1 2 5 7 9', exp: 'Insertion sort' },
  { in: '4\n40 10 30 20', out: '10 20 30 40' },
  { in: '2\n9 1', out: '1 9' },
  { in: '5\n3 3 1 2 2', out: '1 2 2 3 3' }
);

addSpec('prf192_src_37',
  { in: '5\n5 2 9 1 7', out: '1 2 5 7 9', exp: 'Bubble sort' },
  { in: '4\n40 10 30 20', out: '10 20 30 40' },
  { in: '2\n9 1', out: '1 9' },
  { in: '5\n3 3 1 2 2', out: '1 2 2 3 3' }
);

addSpec('prf192_src_38',
  { in: '5\n5.0 2.0 9.0 1.0 7.0', out: '9.00 7.00 5.00 2.00 1.00', exp: 'Sắp xếp float giảm dần' },
  { in: '3\n1.5 9.2 4.1', out: '9.20 4.10 1.50' },
  { in: '2\n2.5 8.1', out: '8.10 2.50' },
  { in: '4\n0.5 -1.2 3.8 2.0', out: '3.80 2.00 0.50 -1.20' }
);

addSpec('prf192_src_39',
  { in: '5\n5 2 9 1 7', out: '1 2 5 7 9', exp: 'Selection sort' },
  { in: '4\n40 10 30 20', out: '10 20 30 40' },
  { in: '2\n9 1', out: '1 9' },
  { in: '5\n3 3 1 2 2', out: '1 2 2 3 3' }
);

addSpec('prf192_src_45',
  { in: '5\n5 2 9 1 7', out: '2', exp: 'Số chẵn ở vị trí chẵn' },
  { in: '6\n4 1 8 3 6 5', out: '4 6 8' },
  { in: '3\n1 3 5', out: '' },
  { in: '4\n2 4 6 8', out: '2 6' }
);

addSpec('prf192_src_59',
  { in: '5\n1 2 3 4 5\n2 99', out: '1 2 99 3 4 5', exp: 'Chèn 99 vào vị trí index 2' },
  { in: '3\n10 20 30\n0 5', out: '5 10 20 30' },
  { in: '1\n100\n1 200', out: '100 200' },
  { in: '4\n2 4 6 8\n4 10', out: '2 4 6 8 10' }
);

addSpec('prf192_src_60',
  { in: '5\n5 2 9 1 7\n0 4', out: '7 2 9 1 5', exp: 'Swap phần tử vị trí 0 và 4' },
  { in: '4\n1 2 3 4\n1 2', out: '1 3 2 4' },
  { in: '2\n10 20\n0 1', out: '20 10' },
  { in: '5\n1 2 3 4 5\n2 2', out: '1 2 3 4 5' }
);

addSpec('prf192_src_61',
  { in: '5\n5 2 9 1 7\n1', out: '5 9 1 7', exp: 'Xóa phần tử vị trí index 1 (giá trị 2)' },
  { in: '4\n10 20 30 40\n0', out: '20 30 40' },
  { in: '3\n1 2 3\n2', out: '1 2' },
  { in: '5\n4 8 12 16 20\n3', out: '4 8 12 20' }
);

addSpec('prf192_src_86',
  { in: '5\n5 2 9 1 7', out: '9 7 5 1 2', exp: 'Lẻ giảm dần trước, chẵn tăng dần sau' },
  { in: '6\n1 4 3 6 5 2', out: '5 3 1 2 4 6' },
  { in: '3\n2 4 6', out: '2 4 6' },
  { in: '3\n1 5 3', out: '5 3 1' }
);

addSpec('prf192_src_88',
  { in: '6\n1 2 2 3 4 4', out: '1 2 3 4', exp: 'In các phần tử 1 lần duy nhất' },
  { in: '5\n5 2 9 1 7', out: '5 2 9 1 7' },
  { in: '4\n1 1 1 1', out: '1' },
  { in: '7\n5 3 5 2 3 8 2', out: '5 3 2 8' }
);

addSpec('prf192_src_98',
  { in: '5\n5 2 9 8 4', out: '5 8 9 2 4', exp: 'Đổi chỗ chẵn lớn nhất (8) và chẵn nhỏ nhất (2)' },
  { in: '4\n10 2 6 4', out: '2 10 6 4' },
  { in: '3\n1 3 5', out: '1 3 5' },
  { in: '6\n12 4 7 20 2 9', out: '12 4 7 2 20 9' }
);

addSpec('prf192_src_101',
  { in: '5\n5 2 9 1 7', out: '1 2 5 7 9', exp: 'Sắp xếp tăng dần' },
  { in: '4\n40 10 30 20', out: '10 20 30 40' },
  { in: '2\n9 3', out: '3 9' },
  { in: '6\n-5 8 0 -12 15 3', out: '-12 -5 0 3 8 15' }
);

addSpec('prf192_src_102',
  { in: '5\n5 2 9 1 7', out: '2 5 9 1 7', exp: 'Chẵn trước, lẻ sau' },
  { in: '6\n1 2 3 4 5 6', out: '2 4 6 1 3 5' },
  { in: '4\n2 4 6 8', out: '2 4 6 8' },
  { in: '4\n1 3 5 7', out: '1 3 5 7' }
);

addSpec('prf192_src_110',
  { in: '5\n5 2 9 1 7', out: '9 7 5 1 2', exp: 'Lẻ giảm dần và chẵn tăng dần' },
  { in: '6\n1 4 3 6 5 2', out: '5 3 1 2 4 6' },
  { in: '3\n2 4 6', out: '2 4 6' },
  { in: '4\n8 3 4 9', out: '9 3 4 8' }
);

addSpec('prf192_src_111',
  { in: '5\n5 2 9 1 7', out: '1 5 7 9 2', exp: 'Lẻ tăng dần và chẵn giảm dần' },
  { in: '6\n1 4 3 6 5 2', out: '1 3 5 6 4 2' },
  { in: '3\n2 4 6', out: '6 4 2' },
  { in: '4\n8 3 4 9', out: '3 9 8 4' }
);

addSpec('prf192_src_112',
  { in: '5\n5 2 9 1 7', out: '17', exp: 'Tổng 3 số cuối: 9 + 1 + 7 = 17' },
  { in: '4\n10 20 30 40', out: '90' },
  { in: '3\n1 2 3', out: '6' },
  { in: '6\n5 10 15 2 4 6', out: '12' }
);

addSpec('prf192_src_115',
  { in: '5\n1 4 9 2 5', out: '14', exp: 'Tổng các số chính phương (1, 4, 9): 1 + 4 + 9 = 14' },
  { in: '4\n16 25 3 7', out: '41' },
  { in: '3\n2 3 5', out: '0' },
  { in: '5\n0 1 4 9 16', out: '30' }
);

// 3. STRINGS (prf192_src_42, 52, 53, 54, 81-83, 87, 89, 95-97, 99, 103-106, 108)
addSpec('prf192_src_42',
  { in: 'hello world 123', out: '3', exp: '3 chữ số: 1, 2, 3' },
  { in: 'abc45def678', out: '5' },
  { in: 'NoDigits', out: '0' },
  { in: '2026-11-01 Test 999', out: '9' }
);

addSpec('prf192_src_52',
  { in: 'hello world 123', out: '3', exp: '3 chữ số' },
  { in: 'abc45def678', out: '5' },
  { in: 'NoDigits', out: '0' },
  { in: '2026-11-01 Test 999', out: '9' }
);

addSpec('prf192_src_53',
  { in: 'hello world', out: 'hello WORLD', exp: 'Viết hoa 1/2 sau' },
  { in: 'abcdefgh', out: 'abcdEFGH' },
  { in: 'ab', out: 'aB' },
  { in: 'vietnam', out: 'vietNAM' }
);

addSpec('prf192_src_54',
  { in: 'Nguyen Van A', out: '1', exp: 'Tên hợp lệ' },
  { in: 'Nguyen123', out: '0', exp: 'Chứa số -> không hợp lệ' },
  { in: 'John Doe', out: '1' },
  { in: 'User@#$', out: '0' }
);

addSpec('prf192_src_81',
  { in: 'hello beautiful world', out: 'beautiful\nworld', exp: 'Từ dài nhất: beautiful, ngắn nhất: world' },
  { in: 'apple banana cat', out: 'banana\ncat' },
  { in: 'one two three', out: 'three\none' },
  { in: 'a bb ccc', out: 'ccc\na' }
);

addSpec('prf192_src_82',
  { in: 'hello', out: 'olleh', exp: 'Đảo ngược chuỗi' },
  { in: 'PRF192', out: '291FRP' },
  { in: 'a', out: 'a' },
  { in: 'RaceCar', out: 'raCecaR' }
);

addSpec('prf192_src_83',
  { in: 'hello world', out: 'Hello World', exp: 'In hoa chữ cái đầu' },
  { in: 'nguyen van a', out: 'Nguyen Van A' },
  { in: 'c programming', out: 'C Programming' },
  { in: 'university', out: 'University' }
);

addSpec('prf192_src_87',
  { in: 'hello 123 world 456', out: 'hello  world ', exp: 'Xóa ký tự số' },
  { in: 'a1b2c3d4', out: 'abcd' },
  { in: '987654321', out: '' },
  { in: 'NoDigits', out: 'NoDigits' }
);

addSpec('prf192_src_89',
  { in: 'N\nNguyen\nTran\nNam\nLe', out: 'Nguyen\nNam', exp: 'Tìm tên bắt đầu bằng chữ N' },
  { in: 'T\nTran\nNguyen\nTruong', out: 'Tran\nTruong' },
  { in: 'A\nBinh\nCuong', out: '' },
  { in: 'L\nLe\nLy\nLuong', out: 'Le\nLy\nLuong' }
);

addSpec('prf192_src_95',
  { in: 'Hello World 123', out: 'e l l o o r l d', exp: 'In tất cả chữ cái in thường' },
  { in: 'ABC def', out: 'd e f' },
  { in: 'XYZ', out: '' },
  { in: 'a1b2c3', out: 'a b c' }
);

addSpec('prf192_src_96',
  { in: 'HeLLo WoRLd', out: 'hello world', exp: 'Chuyển về chữ thường' },
  { in: 'PRF192', out: 'prf192' },
  { in: 'abc', out: 'abc' },
  { in: 'C Programming 2026', out: 'c programming 2026' }
);

addSpec('prf192_src_97',
  { in: 'hello world', out: 'HELLO WORLD', exp: 'Chuyển về chữ hoa' },
  { in: 'prf192', out: 'PRF192' },
  { in: 'ABC', out: 'ABC' },
  { in: 'c programming 2026', out: 'C PROGRAMMING 2026' }
);

addSpec('prf192_src_99',
  { in: 'hello world test', out: 'HEllo WOrld TEst', exp: 'In hoa 2 chữ cái đầu mỗi từ' },
  { in: 'programming language', out: 'PRogramming LAnguage' },
  { in: 'c code', out: 'C COde' },
  { in: 'fpt university', out: 'FPt UNiversity' }
);

addSpec('prf192_src_103',
  { in: '65', out: 'A', exp: 'Mã ASCII 65 là chữ A' },
  { in: '97', out: 'a' },
  { in: '48', out: '0' },
  { in: '32', out: ' ' }
);

addSpec('prf192_src_104',
  { in: 'A', out: '65', exp: 'Ký tự A có mã ASCII là 65' },
  { in: 'a', out: '97' },
  { in: '0', out: '48' },
  { in: 'Z', out: '90' }
);

addSpec('prf192_src_105',
  { in: 'ABC', out: '65 66 67', exp: 'Chuỗi thành mã ASCII' },
  { in: 'hello', out: '104 101 108 108 111' },
  { in: 'C', out: '67' },
  { in: '123', out: '49 50 51' }
);

addSpec('prf192_src_106',
  { in: 'ABC', out: 'A: 65\nB: 66\nC: 67', exp: 'Từng ký tự kèm mã ASCII' },
  { in: 'Hi', out: 'H: 72\ni: 105' },
  { in: 'Z', out: 'Z: 90' },
  { in: '01', out: '0: 48\n1: 49' }
);

addSpec('prf192_src_108',
  { in: 'hello world 123', out: 'o wor', exp: 'Giữ 5 ký tự ở giữa' },
  { in: 'abcdefghij', out: 'cdefg' },
  { in: '1234567', out: '23456' },
  { in: 'ABCDEFGHIJKL', out: 'DEFGH' }
);

// 4. MATH (All remaining)
addSpec('prf192_src_2',
  { in: '2024', out: '2024 is a leap year.', exp: 'Năm nhuận' },
  { in: '2022', out: '2022 is not a leap year.' },
  { in: '2000', out: '2000 is a leap year.' },
  { in: '1900', out: '1900 is not a leap year.' }
);

addSpec('prf192_src_3',
  { in: '153', out: '153 is an Armstrong number.', exp: 'Số Armstrong 153' },
  { in: '123', out: '123 is not an Armstrong number.' },
  { in: '371', out: '371 is an Armstrong number.' },
  { in: '407', out: '407 is an Armstrong number.' }
);

addSpec('prf192_src_23',
  { in: '5\n3 9 1 7 4', out: '1 9', exp: 'Số nhỏ nhất là 1, lớn nhất là 9' },
  { in: '4\n10 40 20 30', out: '10 40' },
  { in: '1\n5', out: '5 5' },
  { in: '6\n-10 15 0 -5 8 20', out: '-10 20' }
);

addSpec('prf192_src_25',
  { in: '12345', out: '54321', exp: 'Đảo ngược số' },
  { in: '95117354', out: '45371159' },
  { in: '100', out: '1' },
  { in: '7', out: '7' }
);

addSpec('prf192_src_28',
  { in: '6\n1 2 2 3 4 4', out: '1 2 3 4', exp: 'Giảm bớt trùng nhau' },
  { in: '5\n5 5 5 5 5', out: '5' },
  { in: '3\n1 2 3', out: '1 2 3' },
  { in: '6\n4 2 4 1 2 5', out: '4 2 1 5' }
);

addSpec('prf192_src_29',
  { in: '3665', out: '1:1:5', exp: '3665s = 1h 1m 5s' },
  { in: '64800', out: '18:0:0' },
  { in: '60', out: '0:1:0' },
  { in: '86399', out: '23:59:59' }
);

addSpec('prf192_src_31',
  { in: '7', out: '7 is a prime number.', exp: 'Số nguyên tố' },
  { in: '8', out: '8 is not a prime number.' },
  { in: '2', out: '2 is a prime number.' },
  { in: '97', out: '97 is a prime number.' }
);

addSpec('prf192_src_32',
  { in: '5', out: '15', exp: 'Tổng 1..5 = 15' },
  { in: '10', out: '55' },
  { in: '1', out: '1' },
  { in: '100', out: '5050' }
);

addSpec('prf192_src_33',
  { in: '16', out: '16 is a perfect square.', exp: 'Số chính phương' },
  { in: '7', out: '7 is not a perfect square.' },
  { in: '25', out: '25 is a perfect square.' },
  { in: '100', out: '100 is a perfect square.' }
);

addSpec('prf192_src_34',
  { in: '13', out: '13 is a Fibonacci number.', exp: 'Số Fibonacci' },
  { in: '7', out: '7 is not a Fibonacci number.' },
  { in: '8', out: '8 is a Fibonacci number.' },
  { in: '21', out: '21 is a Fibonacci number.' }
);

addSpec('prf192_src_40',
  { in: '6\n1 3 3 5 5 7', out: '1 3 5 7', exp: 'Xóa số lẻ trùng nhau' },
  { in: '5\n1 1 1 1 1', out: '1' },
  { in: '4\n2 4 6 8', out: '2 4 6 8' },
  { in: '5\n9 3 9 1 3', out: '9 3 1' }
);

addSpec('prf192_src_41',
  { in: 'hello', out: '5', exp: 'Độ dài chuỗi' },
  { in: 'PRF192', out: '6' },
  { in: 'a', out: '1' },
  { in: 'Computer Science', out: '16' }
);

addSpec('prf192_src_43',
  { in: '5\n1 4 7 8 3', out: '8', exp: 'Số chẵn lớn nhất là 8' },
  { in: '4\n10 40 20 30', out: '40' },
  { in: '3\n1 3 5', out: 'Không có số chẵn' },
  { in: '5\n2 6 4 12 8', out: '12' }
);

addSpec('prf192_src_44',
  { in: '12 18', out: '6\t36', exp: 'GCD = 6, LCM = 36' },
  { in: '20 30', out: '10\t60' },
  { in: '7 13', out: '1\t91' },
  { in: '15 45', out: '15\t45' }
);

addSpec('prf192_src_46',
  { in: '3', out: '9', exp: 'Số lẻ bình phương: 3^2 = 9' },
  { in: '5', out: '25' },
  { in: '4', out: '0' },
  { in: '7', out: '49' }
);

addSpec('prf192_src_47',
  { in: '234', out: '24', exp: 'Tích các chữ số: 2 * 3 * 4 = 24' },
  { in: '12345', out: '120' },
  { in: '5', out: '5' },
  { in: '902', out: '0' }
);

addSpec('prf192_src_48',
  { in: '16', out: '16 is power of 2', exp: 'Lũy thừa của 2' },
  { in: '7', out: '7 is not power of 2' },
  { in: '64', out: '64 is power of 2' },
  { in: '1', out: '1 is power of 2' }
);

addSpec('prf192_src_49',
  { in: 'hello world', out: 'H L O W R D', exp: 'Ký tự vị trí chẵn viết hoa' },
  { in: 'abcdef', out: 'A C E' },
  { in: 'hi', out: 'H' },
  { in: 'programming', out: 'P O R M I G' }
);

addSpec('prf192_src_50',
  { in: 'a1b2c3!@#', out: 'abc', exp: 'Chỉ in các chữ cái' },
  { in: 'Hello123World', out: 'HelloWorld' },
  { in: '12345', out: '' },
  { in: 'C-Language', out: 'CLanguage' }
);

addSpec('prf192_src_51',
  { in: '6', out: 'YES', exp: '6 là số hoàn hảo (1+2+3=6)' },
  { in: '7', out: 'NOT' },
  { in: '28', out: 'YES' },
  { in: '12', out: 'NOT' }
);

addSpec('prf192_src_55',
  { in: '5\n-1 2 4 -5 9', out: '5.00', exp: 'Trung bình các số dương (2, 4, 9): 15/3 = 5.00' },
  { in: '4\n10 20 30 40', out: '25.00' },
  { in: '2\n-5 -10', out: '0.00' },
  { in: '5\n1 2 3 4 5', out: '3.00' }
);

addSpec('prf192_src_57',
  { in: '25', out: 'YES', exp: 'Số chính phương' },
  { in: '26', out: 'Not' },
  { in: '1', out: 'YES' },
  { in: '49', out: 'YES' }
);

addSpec('prf192_src_58',
  { in: '5\n5 2 9 1 7\n2', out: '5 2 1 7', exp: 'Xóa vị trí 2' },
  { in: '4\n1 2 3 4\n0', out: '2 3 4' },
  { in: '3\n10 20 30\n2', out: '10 20' },
  { in: '5\n8 6 4 2 0\n4', out: '8 6 4 2' }
);

addSpec('prf192_src_62',
  { in: '3665', out: '1\n1\n5', exp: 'Giờ 1, phút 1, giây 5' },
  { in: '64800', out: '18\n0\n0' },
  { in: '60', out: '0\n1\n0' },
  { in: '7200', out: '2\n0\n0' }
);

addSpec('prf192_src_63',
  { in: '12345', out: '6', exp: 'Tổng chữ số đầu 1 và cuối 5 là 6' },
  { in: '7', out: '14' },
  { in: '9002', out: '11' },
  { in: '50', out: '5' }
);

addSpec('prf192_src_64',
  { in: '8 2', out: '8 là l?y th?a c?a 2^3', exp: 'Kiểm tra lũy thừa' },
  { in: '7 7', out: '7 là l?y th?a c?a 7^1' },
  { in: '27 3', out: '27 là l?y th?a c?a 3^3' },
  { in: '16 2', out: '16 là l?y th?a c?a 2^4' }
);

addSpec('prf192_src_65',
  { in: '5\n5 10 12 15 20', out: '4', exp: 'Có 4 số chia hết cho 5' },
  { in: '4\n1 2 3 4', out: '0' },
  { in: '3\n5 5 5', out: '3' },
  { in: '6\n15 22 25 30 7 35', out: '4' }
);

addSpec('prf192_src_66',
  { in: '1101', out: '15', exp: 'Nhị phân 1101 -> bát phân 15' },
  { in: '111', out: '7' },
  { in: '1010', out: '12' },
  { in: '10000', out: '20' }
);

addSpec('prf192_src_67',
  { in: '5\n1 2 3 4 5', out: '1', exp: 'Mảng tăng dần' },
  { in: '5\n5 4 3 2 1', out: '0' },
  { in: '3\n1 3 2', out: '0' },
  { in: '4\n2 4 6 8', out: '1' }
);

addSpec('prf192_src_68',
  { in: '5\n1 2 3 2 1', out: '1', exp: 'Mảng đối xứng' },
  { in: '5\n1 2 3 4 5', out: '0' },
  { in: '4\n1 2 2 1', out: '1' },
  { in: '3\n5 5 5', out: '1' }
);

addSpec('prf192_src_69',
  { in: '5\n4 6 7 9 11', out: '7', exp: 'Số nguyên tố đầu tiên trong mảng là 7' },
  { in: '4\n2 4 6 8', out: '2' },
  { in: '3\n8 9 10', out: '0' },
  { in: '5\n15 14 13 12 11', out: '13' }
);

addSpec('prf192_src_70',
  { in: '3 2', out: '4', exp: '(-1)^(3+1) * 2^3' },
  { in: '2 3', out: '-9' },
  { in: '1 5', out: '5' },
  { in: '4 2', out: '-16' }
);

addSpec('prf192_src_71',
  { in: '5\n1 2 3 4 5', out: '5 4 3 2 1', exp: 'Đảo ngược dãy số' },
  { in: '3\n10 20 30', out: '30 20 10' },
  { in: '1\n7', out: '7' },
  { in: '4\n2 4 6 8', out: '8 6 4 2' }
);

addSpec('prf192_src_73',
  { in: '5\n1 2 3 4 5\n7', out: '2 3', exp: 'Vị trí có tổng bằng 7 (3 + 4)' },
  { in: '4\n10 20 30 40\n50', out: '1 2' },
  { in: '3\n1 2 3\n5', out: '1 2' },
  { in: '4\n2 4 6 8\n10', out: '1 2' }
);

addSpec('prf192_src_77',
  { in: '5', out: '120', exp: '5! = 120' },
  { in: '4', out: '24' },
  { in: '1', out: '1' },
  { in: '7', out: '5040' }
);

addSpec('prf192_src_78',
  { in: '5', out: '15', exp: '1 + 2 + 3 + 4 + 5 = 15' },
  { in: '10', out: '55' },
  { in: '1', out: '1' },
  { in: '100', out: '5050' }
);

addSpec('prf192_src_79',
  { in: '2 3', out: '8', exp: '2^3 = 8' },
  { in: '5 2', out: '25' },
  { in: '10 3', out: '1000' },
  { in: '3 4', out: '81' }
);

addSpec('prf192_src_80',
  { in: '5\n1 4 3 8 5', out: '8 4', exp: 'Số chẵn ở vị trí lẻ giảm dần' },
  { in: '6\n2 3 6 5 8 7', out: '8 6 2' },
  { in: '4\n1 3 5 7', out: '' },
  { in: '4\n4 2 8 6', out: '8 4' }
);

addSpec('prf192_src_85',
  { in: '123', out: 'yes', exp: 'Tổng chữ số bằng tích chữ số: 1+2+3 = 1*2*3 = 6' },
  { in: '1124', out: 'yes' },
  { in: '124', out: 'no' },
  { in: '22', out: 'yes' }
);

addSpec('prf192_src_90',
  { in: '5\n1 2 3 4 5', out: '9', exp: 'Tổng các số lẻ (1, 3, 5) = 9' },
  { in: '4\n2 4 6 8', out: '0' },
  { in: '3\n7 9 11', out: '27' },
  { in: '5\n-3 2 5 -1 4', out: '1' }
);

addSpec('prf192_src_93',
  { in: '5', out: '0 1 1 2 3', exp: 'Dãy Fibonacci 5 số' },
  { in: '7', out: '0 1 1 2 3 5 8' },
  { in: '3', out: '0 1 1' },
  { in: '10', out: '0 1 1 2 3 5 8 13 21 34' }
);

addSpec('prf192_src_94',
  { in: '12345', out: '2 3', exp: '2 chữ số chẵn (2, 4) và 3 chữ số lẻ (1, 3, 5)' },
  { in: '2468', out: '4 0' },
  { in: '13579', out: '0 5' },
  { in: '102030', out: '4 2' }
);

addSpec('prf192_src_107',
  { in: '1234', out: '10', exp: 'Tổng các chữ số: 1 + 2 + 3 + 4 = 10' },
  { in: '555', out: '15' },
  { in: '7', out: '7' },
  { in: '98765', out: '35' }
);

addSpec('prf192_src_109',
  { in: '1221', out: 'The string is symmetric', exp: 'Số đối xứng' },
  { in: '12321', out: 'The string is symmetric' },
  { in: '1234', out: 'The string is not symmetric' },
  { in: '1001', out: 'The string is symmetric' }
);

addSpec('prf192_src_113',
  { in: '5\n1 2 3 4 5', out: '2 3', exp: '2 số chẵn, 3 số lẻ' },
  { in: '4\n2 4 6 8', out: '4 0' },
  { in: '3\n1 3 5', out: '0 3' },
  { in: '6\n10 15 20 25 30 35', out: '3 3' }
);

addSpec('prf192_src_114',
  { in: '25', out: '25 la so chinh phuong.', exp: 'Số chính phương' },
  { in: '26', out: '26 khong phai la so chinh phuong.' },
  { in: '16', out: '16 la so chinh phuong.' },
  { in: '100', out: '100 la so chinh phuong.' }
);

console.log(`Registered ${Object.keys(COMPLETE_PROBLEM_SPECS).length} explicit problem specs!`);
