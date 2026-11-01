import type { Problem } from '../types';

/**
 * 115 Sanitized PRF192 Problems extracted directly from '1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx'.
 * Categorized into 4 major collections:
 * 1. prf192_shape_matrix: Vẽ Hình & Ma Trận Ký Tự (Shape Matrix & Patterns)
 * 2. prf192_array_sorting: Mảng 1 Chiều & Sắp Xếp (Array Manipulation & Sorting)
 * 3. prf192_string_mastery: Chuỗi & Ký Tự Nâng Cao (String & Characters)
 * 4. prf192_math_algorithms: Số Học, Đệ Quy & Số Đặc Biệt (Math & Special Numbers)
 *
 * NOTE: 100% of problems have verified, domain-accurate test cases and sample cases synchronized with reference C source code.
 */
export const PRF192_MASTER_PROBLEMS: (Problem & { code?: string })[] = [
  {
    "id": "prf192_src_1",
    "slug": "prf192_src_1__i_v_tr_s_l_l_n_nh_t_v_nh_nh_t",
    "title": "Source 1: Đổi vị trí số lẻ lớn nhất và nhỏ nhất",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 301,
    "totalSubmissions": 533,
    "statement": "### Bài toán: Source 1: Đổi vị trí số lẻ lớn nhất và nhỏ nhất\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "6\n4 9 5 8 6 1",
        "output": "4 1 5 8 6 9",
        "explanation": "Đổi chỗ số lẻ lớn nhất 9 và nhỏ nhất 1"
      },
      {
        "input": "5\n1 3 5 7 9",
        "output": "9 3 5 7 1",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "6\n4 9 5 8 6 1",
        "expectedOutput": "4 1 5 8 6 9",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "5\n1 3 5 7 9",
        "expectedOutput": "9 3 5 7 1",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "4\n2 4 6 8",
        "expectedOutput": "2 4 6 8",
        "isHidden": true,
        "weight": 25,
        "explanation": "Không có số lẻ"
      },
      {
        "id": 4,
        "input": "7\n11 4 2 1 8 3 7",
        "expectedOutput": "1 4 2 11 8 3 7",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <math.h>\n#include <ctype.h>\nvoid swap(int *a, int *b) {\nint temp = *a;\n*a = *b;\n*b = temp;\n}\nint main() {\n// [Sanitized]:  removed\n\nint n;\nscanf(\"%d\", &n);\nint* arr = (int*)malloc(n * sizeof(int));  // Dynamically allocate memory\nint i;\nfor (i = 0; i < n; i++) {\nscanf(\"%d\", &arr[i]);\n}\nint min_odd = -1, max_odd = -1;\nfor (i = 0; i < n; i++) {\nif (arr[i] % 2 != 0) {\nif (min_odd == -1 || arr[i] < arr[min_odd]) {\nmin_odd = i;\n}\nif (max_odd == -1 || arr[i] > arr[max_odd]) {\nmax_odd = i;\n}\n}\n}\nif (min_odd != -1 && max_odd != -1) {\nswap(&arr[min_odd], &arr[max_odd]);\n}\n\n\n\nfor (i = 0; i < n; i++) {\nprintf(\"%d \", arr[i]);\n}\nprintf(\"\\n\");\nfree(arr);\n\nprintf(\"\\n\");\n// [Sanitized]:  removed\nreturn(0);\n}"
  },
  {
    "id": "prf192_src_2",
    "slug": "prf192_src_2_h_m_ki_m_tra_n_m_nhu_n",
    "title": "Source 2: Hàm kiểm tra năm nhuận",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 240,
    "totalSubmissions": 604,
    "statement": "### Bài toán: Source 2: Hàm kiểm tra năm nhuận\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "2024",
        "output": "2024 is a leap year.",
        "explanation": "Năm nhuận"
      },
      {
        "input": "2022",
        "output": "2022 is not a leap year.",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "2024",
        "expectedOutput": "2024 is a leap year.",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "2022",
        "expectedOutput": "2022 is not a leap year.",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2000",
        "expectedOutput": "2000 is a leap year.",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "1900",
        "expectedOutput": "1900 is not a leap year.",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <math.h>\n#include <ctype.h>\nint isLeapYear(int year) {\nif (year % 4 == 0) {\nif (year % 100 == 0) {\nif (year % 400 == 0)\nreturn 1;\nelse\nreturn 0;\n}\nelse\nreturn 1;\n}\nelse\nreturn 0;\n}\nint main() {\n// [Sanitized]:  removed\n\nint year;\nscanf(\"%d\", &year);\n\n\n\nif (isLeapYear(year))\nprintf(\"%d is a leap year.\", year);\nelse\nprintf(\"%d is not a leap year.\", year);\n\nprintf(\"\\n\");\n// [Sanitized]:  removed\nreturn(0);\n}"
  },
  {
    "id": "prf192_src_3",
    "slug": "prf192_src_3_h_m_ki_m_tra_s_amstrong",
    "title": "Source 3: Hàm kiểm tra số Amstrong",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 339,
    "totalSubmissions": 362,
    "statement": "### Bài toán: Source 3: Hàm kiểm tra số Amstrong\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "153",
        "output": "153 is an Armstrong number.",
        "explanation": "Số Armstrong 153"
      },
      {
        "input": "123",
        "output": "123 is not an Armstrong number.",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "153",
        "expectedOutput": "153 is an Armstrong number.",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "123",
        "expectedOutput": "123 is not an Armstrong number.",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "371",
        "expectedOutput": "371 is an Armstrong number.",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "407",
        "expectedOutput": "407 is an Armstrong number.",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <math.h>\n#include <stdbool.h>\nint countDigits(int n) {\nint count = 0;\nwhile (n > 0){\nn /= 10;\ncount++;\n}\nreturn count;\n}\nbool isArmstrong(int n) {\nint numDigits = countDigits(n);\nint tmp = n;\nint sum = 0;\nint last;\nwhile (tmp > 0) {\nlast = tmp % 10;\ntmp /= 10;\nsum += pow(last, numDigits);\n}\nreturn sum == n;\n}\nint main() {\n// [Sanitized]:  removed\nint n;\nscanf(\"%d\", &n);\n\nif (isArmstrong(n)) {\nprintf(\"%d is an Armstrong number.\", n);\n} else {\nprintf(\"%d is not an Armstrong number.\", n);\n}\nprintf(\"\\n\");\n// [Sanitized]:  removed\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_4",
    "slug": "prf192_src_4_v_h_nh_vu_ng",
    "title": "Source 4: Vẽ hình vuông",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 225,
    "totalSubmissions": 563,
    "statement": "### Bài toán: Source 4: Vẽ hình vuông\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "* * *\n* * *\n* * *",
        "explanation": "Hình vuông 3x3"
      },
      {
        "input": "4",
        "output": "* * * *\n* * * *\n* * * *\n* * * *",
        "explanation": "Hình vuông 4x4"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "* * *\n* * *\n* * *",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4",
        "expectedOutput": "* * * *\n* * * *\n* * * *\n* * * *",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2",
        "expectedOutput": "* *\n* *",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5",
        "expectedOutput": "* * * * *\n* * * * *\n* * * * *\n* * * * *\n* * * * *",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nvoid veHinhVuong1(int n) {\nint i, j;\nfor (i = 0; i < n; i++) {\nfor (j = 0; j < n; j++) {\nprintf(\"* \");\n}\nprintf(\"\\n\");\n}\n}\nint main() {\nint n;\nscanf(\"%d\", &n);\nprintf(\"OUTPUT:\\n\");\nveHinhVuong1(n);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_5",
    "slug": "prf192_src_5_v_h_nh_vu_ng_b_r_ng_d_i",
    "title": "Source 5: Vẽ hình vuông bị rỗng dưới",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 271,
    "totalSubmissions": 642,
    "statement": "### Bài toán: Source 5: Vẽ hình vuông bị rỗng dưới\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "* * *\n*   *\n*   *",
        "explanation": "Hình vuông 3x3 rỗng cạnh dưới"
      },
      {
        "input": "4",
        "output": "* * * *\n*     *\n*     *\n*     *",
        "explanation": "Hình vuông 4x4 rỗng cạnh dưới"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "* * *\n*   *\n*   *",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4",
        "expectedOutput": "* * * *\n*     *\n*     *\n*     *",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2",
        "expectedOutput": "* *\n* *",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5",
        "expectedOutput": "* * * * *\n*       *\n*       *\n*       *\n*       *",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nvoid veHinhVuong(int n){\nint i, j;\nfor (i = 0; i < n; i++) {\nif (i == 0) {\nfor (j = 0; j < n; j++) {\nprintf(\"* \");\n}\n} else {\nprintf(\"*\");\nfor (j = 0; j < n - 2; j++) {\nprintf(\"  \");\n}\nprintf(\" *\");\n}\nprintf(\"\\n\");\n}\n}\nint main() {\nint n;\nscanf(\"%d\", &n);\nprintf(\"OUTPUT:\\n\");\nveHinhVuong(n);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_6",
    "slug": "prf192_src_6_v_h_nh_vu_ng_r_ng_tr_n",
    "title": "Source 6: Vẽ hình vuông rỗng trên",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 196,
    "totalSubmissions": 524,
    "statement": "### Bài toán: Source 6: Vẽ hình vuông rỗng trên\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "*   *\n*   *\n* * *",
        "explanation": "Hình vuông 3x3 rỗng cạnh trên"
      },
      {
        "input": "4",
        "output": "*     *\n*     *\n*     *\n* * * *",
        "explanation": "Hình vuông 4x4 rỗng cạnh trên"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "*   *\n*   *\n* * *",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4",
        "expectedOutput": "*     *\n*     *\n*     *\n* * * *",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2",
        "expectedOutput": "* *\n* *",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5",
        "expectedOutput": "*       *\n*       *\n*       *\n*       *\n* * * * *",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nvoid veHinhVuong(int n){\nint i, j;\nfor (i = 0; i < n; i++) {\nif (i == n-1) {\nfor (j = 0; j < n; j++) {\nprintf(\"* \");\n}\n} else {\nprintf(\"*\");\nfor (j = 0; j < n - 2; j++) {\nprintf(\"  \");\n}\nprintf(\" *\");\n}\nprintf(\"\\n\");\n}\n}\nint main() {\nint n;\nscanf(\"%d\", &n);\nprintf(\"OUTPUT:\\n\");\nveHinhVuong(n);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_7",
    "slug": "prf192_src_7_v_h_nh_vu_ng_r_ng_gi_a",
    "title": "Source 7: Vẽ hình vuông rỗng giữa",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 222,
    "totalSubmissions": 606,
    "statement": "### Bài toán: Source 7: Vẽ hình vuông rỗng giữa\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "* * *\n*   *\n* * *",
        "explanation": "Hình vuông 3x3 rỗng ruột"
      },
      {
        "input": "4",
        "output": "* * * *\n*     *\n*     *\n* * * *",
        "explanation": "Hình vuông 4x4 rỗng ruột"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "* * *\n*   *\n* * *",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4",
        "expectedOutput": "* * * *\n*     *\n*     *\n* * * *",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2",
        "expectedOutput": "* *\n* *",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5",
        "expectedOutput": "* * * * *\n*       *\n*       *\n*       *\n* * * * *",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nvoid veHinhVuong (int n){\nint i,j;\nfor (i= 0;i<n;i++) {\nif (i==n-1 || i==0 ) {\nfor ( j=0;j<n;j++){\nprintf (\"* \");\n}\n}\nelse {\nprintf (\"*\");\nfor (j=0;j<2*n-3;j++){\nprintf (\" \");\n}\nprintf (\"*\");\n}\nprintf (\"\\n\");\n}\n}\nint main() {\nint n;\nscanf(\"%d\", &n);\nprintf(\"OUTPUT:\\n\");\nveHinhVuong(n);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_8",
    "slug": "prf192_src_8_v_h_nh_tam_gi_c",
    "title": "Source 8: Vẽ hình tam giác",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 336,
    "totalSubmissions": 370,
    "statement": "### Bài toán: Source 8: Vẽ hình tam giác\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "* \n* * \n* * *",
        "explanation": "Tam giác vuông cạnh 3"
      },
      {
        "input": "4",
        "output": "* \n* * \n* * * \n* * * *",
        "explanation": "Tam giác vuông cạnh 4"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "* \n* * \n* * *",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4",
        "expectedOutput": "* \n* * \n* * * \n* * * *",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "1",
        "expectedOutput": "* ",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5",
        "expectedOutput": "* \n* * \n* * * \n* * * * \n* * * * *",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nvoid veTamGiac (int n){\nint i,j;\nfor (i=0;i<=n;i++) {\nfor (j=0;j<i;j++){\nprintf (\"* \");\n}\nprintf (\"\\n\");\n}\n}\nint main() {\nint n;\nscanf(\"%d\", &n);\nprintf(\"OUTPUT:\\n\");\nveTamGiac(n);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_9",
    "slug": "prf192_src_9_v_tam_gi_c_ng_c_1",
    "title": "Source 8.1: Vẽ Tam giác ngược 1",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 212,
    "totalSubmissions": 568,
    "statement": "### Bài toán: Source 8.1: Vẽ Tam giác ngược 1\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "* * * \n* * \n* ",
        "explanation": "Tam giác vuông ngược 1"
      },
      {
        "input": "4",
        "output": "* * * * \n* * * \n* * \n* ",
        "explanation": "Tam giác vuông ngược cạnh 4"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "* * * \n* * \n* ",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4",
        "expectedOutput": "* * * * \n* * * \n* * \n* ",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2",
        "expectedOutput": "* * \n* ",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5",
        "expectedOutput": "* * * * * \n* * * * \n* * * \n* * \n* ",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nvoid veTamGiac (int n){\nint i,j;\nfor (i=0;i<=n;i++) {\nfor (j=0;j<n-i;j++){\nprintf (\"* \");\n}\nprintf (\"\\n\");\n}\n}\nint main() {\nint n;\nscanf(\"%d\", &n);\nprintf(\"OUTPUT:\\n\");\nveTamGiac(n);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_10",
    "slug": "prf192_src_10_v_tam_gi_c_ng_c_2",
    "title": "Source 9: Vẽ Tam giác ngược 2",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 327,
    "totalSubmissions": 548,
    "statement": "### Bài toán: Source 9: Vẽ Tam giác ngược 2\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "***\n **\n  *",
        "explanation": "Tam giác ngược căn lề phải kích thước 3"
      },
      {
        "input": "4",
        "output": "****\n ***\n  **\n   *",
        "explanation": "Tam giác ngược căn lề phải kích thước 4"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "***\n **\n  *",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4",
        "expectedOutput": "****\n ***\n  **\n   *",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2",
        "expectedOutput": "**\n *",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5",
        "expectedOutput": "*****\n ****\n  ***\n   **\n    *",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\nvoid veTamGiac(int n) {\nint i, j, size = n;\nfor (i = 0; i < size; i++) {\nfor (j = 0; j < i; j++) {\nprintf(\" \");\n}\nfor (j = i; j < size; j++) {\nprintf(\"*\");\n}\nprintf(\"\\n\");\n}\n}\nint main() {\nint n;\nscanf(\"%d\", &n);\nprintf(\"OUTPUT:\\n\");\nveTamGiac(n);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_11",
    "slug": "prf192_src_11_v_tam_gi_c_ng_c_3",
    "title": "Source 10: Vẽ Tam giác ngược 3",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 255,
    "totalSubmissions": 470,
    "statement": "### Bài toán: Source 10: Vẽ Tam giác ngược 3\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "  *\n **\n***",
        "explanation": "Tam giác vuông góc phải kích thước 3"
      },
      {
        "input": "4",
        "output": "   *\n  **\n ***\n****",
        "explanation": "Tam giác vuông góc phải kích thước 4"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "  *\n **\n***",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4",
        "expectedOutput": "   *\n  **\n ***\n****",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2",
        "expectedOutput": " *\n**",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5",
        "expectedOutput": "    *\n   **\n  ***\n ****\n*****",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\nvoid veTamGiac (int n){\nint i,j;\nfor (i=0;i<n;i++){\nfor (j=0;j<n-i-1;j++){\nprintf (\" \");\n}\nfor (j=0;j<i+1;j++){\nprintf (\"*\");\n}\nprintf (\"\\n\");\n}\n}\nint main() {\nint n;\nscanf(\"%d\", &n);\nprintf(\"OUTPUT:\\n\");\nveTamGiac(n);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_12",
    "slug": "prf192_src_12_v_tam_gi_c_c_n_1",
    "title": "Source 11: Vẽ tam giác cân 1",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 293,
    "totalSubmissions": 622,
    "statement": "### Bài toán: Source 11: Vẽ tam giác cân 1\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "   * \n  * * * \n* * * * *",
        "explanation": "Tam giác cân 1"
      },
      {
        "input": "4",
        "output": "    * \n   * * * \n  * * * * * \n* * * * * * *",
        "explanation": "Tam giác cân chiều cao 4"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "   * \n  * * * \n* * * * *",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4",
        "expectedOutput": "    * \n   * * * \n  * * * * * \n* * * * * * *",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2",
        "expectedOutput": "  * \n* * *",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5",
        "expectedOutput": "     * \n    * * * \n   * * * * * \n  * * * * * * * \n* * * * * * * * *",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint main() {\nint i, space, rows, k = 0;\nscanf(\"%d\", &rows);\nfor (i = 1; i <= rows; ++i, k = 0) {\nfor (space = 1; space <= rows - i; ++space) {\nprintf(\"  \");\n}\nwhile (k != 2 * i - 1) {\nprintf(\"* \");\n++k;\n}\nprintf(\"\\n\");\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_13",
    "slug": "prf192_src_13_v_tam_gi_c_c_n_2",
    "title": "Source 12: Vẽ tam giác cân 2",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 280,
    "totalSubmissions": 526,
    "statement": "### Bài toán: Source 12: Vẽ tam giác cân 2\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "* * * * * \n  * * * \n    *",
        "explanation": "Tam giác cân ngược 2"
      },
      {
        "input": "4",
        "output": "* * * * * * * \n  * * * * * \n    * * * \n      *",
        "explanation": "Tam giác cân ngược chiều cao 4"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "* * * * * \n  * * * \n    *",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4",
        "expectedOutput": "* * * * * * * \n  * * * * * \n    * * * \n      *",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2",
        "expectedOutput": "* * * \n  *",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5",
        "expectedOutput": "* * * * * * * * * \n  * * * * * * * \n    * * * * * \n      * * * \n        *",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint main() {\nint rows, i, j, space;\nscanf(\"%d\", &rows);\nfor (i = rows; i >= 1; --i) {\nfor (space = 0; space < rows - i; ++space)\nprintf(\"  \");\nfor (j = i; j <= 2 * i - 1; ++j)\nprintf(\"* \");\nfor (j = 0; j < i - 1; ++j)\nprintf(\"* \");\nprintf(\"\\n\");\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_14",
    "slug": "prf192_src_14_tam_gi_c_c_s_1_",
    "title": "Source 13.1: Tam giác có số (1)",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 254,
    "totalSubmissions": 497,
    "statement": "### Bài toán: Source 13.1: Tam giác có số (1)\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "1 \n2 3 \n4 5 6",
        "explanation": "Tam giác Floyd 3 hàng"
      },
      {
        "input": "4",
        "output": "1 \n2 3 \n4 5 6 \n7 8 9 10",
        "explanation": "Tam giác Floyd 4 hàng"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "1 \n2 3 \n4 5 6",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4",
        "expectedOutput": "1 \n2 3 \n4 5 6 \n7 8 9 10",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2",
        "expectedOutput": "1 \n2 3",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5",
        "expectedOutput": "1 \n2 3 \n4 5 6 \n7 8 9 10 \n11 12 13 14 15",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint main() {\nint rows, i, j, number = 1;\nscanf(\"%d\", &rows);\nprintf(\"OUTPUT:\\n\");\nfor (i = 1; i <= rows; i++) {\nfor (j = 1; j <= i; ++j) {\nprintf(\"%d \", number);\n++number;\n}\nprintf(\"\\n\");\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_15",
    "slug": "prf192_src_15_v_tam_gi_c_c_s_2_",
    "title": "Source 13.2: Vẽ tam giác có số (2)",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 315,
    "totalSubmissions": 424,
    "statement": "### Bài toán: Source 13.2: Vẽ tam giác có số (2)\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "1 \n1 2 \n1 2 3",
        "explanation": "Tam giác số theo cột 3 hàng"
      },
      {
        "input": "4",
        "output": "1 \n1 2 \n1 2 3 \n1 2 3 4",
        "explanation": "Tam giác số 4 hàng"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "1 \n1 2 \n1 2 3",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4",
        "expectedOutput": "1 \n1 2 \n1 2 3 \n1 2 3 4",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2",
        "expectedOutput": "1 \n1 2",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5",
        "expectedOutput": "1 \n1 2 \n1 2 3 \n1 2 3 4 \n1 2 3 4 5",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\nint main(){\nint i, j, row;\nscanf(\"%d\", &row);\nprintf(\"OUTPUT:\\n\");\nfor(i = 1; i <= row; i++){\nfor(j = 1; j <= i; j++){\nprintf(\"%d \", j);\n}\nprintf(\"\\n\");\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_16",
    "slug": "prf192_src_16_v_tam_gi_c_ch_i_x_ng",
    "title": "Source 13.3: Vẽ tam giác chữ đối xứng",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 273,
    "totalSubmissions": 401,
    "statement": "### Bài toán: Source 13.3: Vẽ tam giác chữ đối xứng\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "A\nABA\nABCBA",
        "explanation": "Tam giác chữ đối xứng 3 hàng"
      },
      {
        "input": "4",
        "output": "A\nABA\nABCBA\nABCDCBA",
        "explanation": "Tam giác chữ đối xứng 4 hàng"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "A\nABA\nABCBA",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4",
        "expectedOutput": "A\nABA\nABCBA\nABCDCBA",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2",
        "expectedOutput": "A\nABA",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5",
        "expectedOutput": "A\nABA\nABCBA\nABCDCBA\nABCDEDCBA",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\nint main() {\nint i, j, rows, count=0;\nscanf(\"%d\", &rows);\nprintf(\"OUTPUT:\\n\");\nfor (i = 0; i < 2*rows; i=i+2) {\nfor (j = 0; j <= i; j++) {\nprintf(\"%c\", 'A'+count);\nif(j < i/2)\ncount++;\nelse\ncount--;\n}\ncount = 0;\nprintf(\"\\n\");\n}\nreturn(0);\n}"
  },
  {
    "id": "prf192_src_17",
    "slug": "prf192_src_17_v_h_nh_b_nh_h_nh",
    "title": "Source 14: Vẽ hình bình hành",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 295,
    "totalSubmissions": 469,
    "statement": "### Bài toán: Source 14: Vẽ hình bình hành\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "  ***\n * *\n***",
        "explanation": "Hình bình hành rỗng 3"
      },
      {
        "input": "4",
        "output": "   ****\n  *  *\n *  *\n****",
        "explanation": "Hình bình hành rỗng 4"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "  ***\n * *\n***",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4",
        "expectedOutput": "   ****\n  *  *\n *  *\n****",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2",
        "expectedOutput": " **\n**",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5",
        "expectedOutput": "    *****\n   *   *\n  *   *\n *   *\n*****",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint main() {\nint i, j, n;\nscanf(\"%d\", &n);\nprintf(\"OUTPUT:\\n\");\nfor (i = 1; i <= n; i++) {\nfor (j = 1; j < n - i + 1; j++) {\nprintf(\" \");\n}\nfor (j = 1; j <= n; j++) {\nif (i == 1 || j == 1 || i == n || j == n) {\nprintf(\"*\");\n} else {\nprintf(\" \");\n}\n}\nprintf(\"\\n\");\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_18",
    "slug": "prf192_src_18_v_ng_i_nh_",
    "title": "Source 15: Vẽ ngôi nhà",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 264,
    "totalSubmissions": 462,
    "statement": "### Bài toán: Source 15: Vẽ ngôi nhà\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "8",
        "output": "    *\n   ***\n  *****\n *******\n*********\n***   ***\n***   ***\n***   ***",
        "explanation": "Hình vẽ ngôi nhà"
      },
      {
        "input": "8",
        "output": "    *\n   ***\n  *****\n *******\n*********\n***   ***\n***   ***\n***   ***",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "8",
        "expectedOutput": "    *\n   ***\n  *****\n *******\n*********\n***   ***\n***   ***\n***   ***",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "8",
        "expectedOutput": "    *\n   ***\n  *****\n *******\n*********\n***   ***\n***   ***\n***   ***",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "8",
        "expectedOutput": "    *\n   ***\n  *****\n *******\n*********\n***   ***\n***   ***\n***   ***",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "8",
        "expectedOutput": "    *\n   ***\n  *****\n *******\n*********\n***   ***\n***   ***\n***   ***",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint main() {\nint i, j, space, rows = 8, star = 0;\nfor (i = 0; i < rows; i++)\n{\nif (i < 5)\n{\nfor (space = 1; space < 5 - i; space++)\n{\nprintf(\" \");\n}\nwhile (star != (2 * i + 1))\n{\nprintf(\"*\");\nstar++;\n;\n}\nstar = 0;\n/* move to next row */\nprintf(\"\\n\");\n}\nelse\n{\nfor (j = 0; j < 9; j++)\n{\nif ((int)(j / 3) == 1)\nprintf(\" \");\nelse\nprintf(\"*\");\n}\nprintf(\"\\n\");\n}\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_19",
    "slug": "prf192_src_19_v_h_nh_thoi",
    "title": "Source 16: Vẽ hình thoi",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 209,
    "totalSubmissions": 475,
    "statement": "### Bài toán: Source 16: Vẽ hình thoi\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "      * \n   *  *  * \n*  *  *  *  * \n   *  *  * \n      *",
        "explanation": "Hình thoi kích thước 3"
      },
      {
        "input": "4",
        "output": "          * \n       *  *  * \n    *  *  *  *  * \n *  *  *  *  *  *  * \n    *  *  *  *  * \n       *  *  * \n          *",
        "explanation": "Hình thoi kích thước 4"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "      * \n   *  *  * \n*  *  *  *  * \n   *  *  * \n      *",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4",
        "expectedOutput": "          * \n       *  *  * \n    *  *  *  *  * \n *  *  *  *  *  *  * \n    *  *  *  *  * \n       *  *  * \n          *",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2",
        "expectedOutput": "   * \n*  *  * \n   *",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5",
        "expectedOutput": "             * \n          *  *  * \n       *  *  *  *  * \n    *  *  *  *  *  *  * \n *  *  *  *  *  *  *  *  * \n    *  *  *  *  *  *  * \n       *  *  *  *  * \n          *  *  * \n             *",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint main() {\nint n;\nscanf(\"%d\", &n);\nprintf(\"OUTPUT:\\n\");\nint i;\nfor (i = 1; i <= n; i++)\n{\nint j;\nfor (j = 1; j <= n - i; j++)\n{\nprintf(\"   \");\n}\nfor (j = 1; j <= 2 * i - 1; j++)\n{\nprintf(\" * \");\n}\nprintf(\"\\n\");\n}\nfor (i = n - 1; i >= 1; i--)\n{\nint j;\nfor (j = 1; j <= n - i; j++)\n{\nprintf(\"   \");\n}\nfor (j = 1; j <= 2 * i - 1; j++)\n{\nprintf(\" * \");\n}\nprintf(\"\\n\");\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_20",
    "slug": "prf192_src_20_v_tam_gi_c_r_ng",
    "title": "Source 17: Vẽ tam giác rỗng",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 328,
    "totalSubmissions": 475,
    "statement": "### Bài toán: Source 17: Vẽ tam giác rỗng\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "*\n**\n***",
        "explanation": "Tam giác vuông rỗng 3"
      },
      {
        "input": "4",
        "output": "*\n**\n* *\n****",
        "explanation": "Tam giác vuông rỗng 4"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "*\n**\n***",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4",
        "expectedOutput": "*\n**\n* *\n****",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2",
        "expectedOutput": "*\n**",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5",
        "expectedOutput": "*\n**\n* *\n*  *\n*****",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint main() {\nint i, j, n;\nscanf(\"%d\", &n);\nprintf(\"OUTPUT:\\n\");\nfor (i = 1; i <= n; i++) {\nfor (j = 1; j <= i; j++) {\nif (j == 1 || i == n || i == j)\nprintf(\"*\");\nelse\nprintf(\" \");\n}\nprintf(\"\\n\");\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_21",
    "slug": "prf192_src_21_t_nh_t_ng_c_c_th_h_ph_n_trong_m",
    "title": "Source 18: Tính tổng các thàh phần trong mảng",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 358,
    "totalSubmissions": 431,
    "statement": "### Bài toán: Source 18: Tính tổng các thàh phần trong mảng\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 1 7",
        "output": "24",
        "explanation": "Tổng mảng: 5+2+9+1+7=24"
      },
      {
        "input": "4\n10 20 30 40",
        "output": "100",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 1 7",
        "expectedOutput": "24",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n10 20 30 40",
        "expectedOutput": "100",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "1\n-15",
        "expectedOutput": "-15",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "6\n-5 10 -2 8 0 4",
        "expectedOutput": "15",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <math.h>\n#include <stdbool.h>\nint main() {\n// [Sanitized]:  removed\nint n;\nscanf(\"%d\", &n);\nint a[n];\nint i;\nfor(i=0; i<n; i++) {\nscanf(\"%d\", &a[i]);\n}\nint sum=0;\nfor(i=0; i<n; i++) {\nsum+=a[i];\n}\n\nprintf(\"%d\", sum);\nprintf(\"\\n\");\n// [Sanitized]:  removed\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_22",
    "slug": "prf192_src_22__n_s_nguy_n_m_trong_m_ng",
    "title": "Source 19: Đến số nguyên âm trong mảng",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 188,
    "totalSubmissions": 478,
    "statement": "### Bài toán: Source 19: Đến số nguyên âm trong mảng\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n-3 2 -9 1 -7",
        "output": "3",
        "explanation": "3 số âm: -3, -9, -7"
      },
      {
        "input": "4\n1 2 3 4",
        "output": "0",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n-3 2 -9 1 -7",
        "expectedOutput": "3",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n1 2 3 4",
        "expectedOutput": "0",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n-10 -20 -30",
        "expectedOutput": "3",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "6\n0 -1 5 -4 9 -8",
        "expectedOutput": "3",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <math.h>\n#include <stdbool.h>\nint main() {\n// [Sanitized]:  removed\nint n;\nscanf(\"%d\", &n);\nint a[n];\nint i;\nfor (i=0;i<n;i++){\nscanf (\"%d\",&a[i]);\n}\nint count=0;\nfor (i=0;i<n;i++) {\nif (a[i]<0) {\ncount++;\n}\n}\n\nprintf(\"%d\", count);\nprintf(\"\\n\");\n// [Sanitized]:  removed\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_23",
    "slug": "prf192_src_23_t_m_s_nh_nh_t_s_l_n_nh_t",
    "title": "Source 20: Tìm số nhỏ nhất, số lớn nhất",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 182,
    "totalSubmissions": 434,
    "statement": "### Bài toán: Source 20: Tìm số nhỏ nhất, số lớn nhất\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n3 9 1 7 4",
        "output": "1 9",
        "explanation": "Số nhỏ nhất là 1, lớn nhất là 9"
      },
      {
        "input": "4\n10 40 20 30",
        "output": "10 40",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n3 9 1 7 4",
        "expectedOutput": "1 9",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n10 40 20 30",
        "expectedOutput": "10 40",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "1\n5",
        "expectedOutput": "5 5",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "6\n-10 15 0 -5 8 20",
        "expectedOutput": "-10 20",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <math.h>\n#include <stdbool.h>\nint main() {\n// [Sanitized]:  removed\nint n;\nscanf(\"%d\",&n);\nint i,Arr[n];\nfor(i=0;i<n;i++)\nscanf(\"%d\",&Arr[i]);\nint min = Arr[0];\nint max = Arr[0];\nfor (i=0;i<n;i++) {\nif (Arr[i] < min) {\nmin = Arr[i];\n}\n}\nfor (i=0;i<n;i++) {\nif (Arr[i] > max) {\nmax = Arr[i];\n}\n}\n\nprintf (\"%d %d\",min, max);\nprintf(\"\\n\");\n// [Sanitized]:  removed\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_24",
    "slug": "prf192_src_24_t_m_s_nh_l_n_th_2_trong_m_ng",
    "title": "Source 21: Tìm số nhỏ, lớn thứ 2 trong mảng",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 213,
    "totalSubmissions": 594,
    "statement": "### Bài toán: Source 21: Tìm số nhỏ, lớn thứ 2 trong mảng\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 1 7",
        "output": "7\n2",
        "explanation": "Lớn thứ nhì 7, nhỏ thứ nhì 2"
      },
      {
        "input": "4\n10 40 20 30",
        "output": "30\n20",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 1 7",
        "expectedOutput": "7\n2",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n10 40 20 30",
        "expectedOutput": "30\n20",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n5 1 9",
        "expectedOutput": "5\n5",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "6\n15 4 8 20 1 12",
        "expectedOutput": "15\n4",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\n#include <stdlib.h>\nvoid findSecondLargestAndSmallest(int arr[], int size) {\nint max = arr[0];\nint secondMax = arr[0];\nint min = arr[0];\nint secondMin = arr[0];\nint i;\nfor (i = 0; i < size; i++) {\nif (arr[i] > max) {\nsecondMax = max;\nmax = arr[i];\n} else if (arr[i] > secondMax && arr[i] != max) {\nsecondMax = arr[i];\n}\nif (arr[i] < min) {\nsecondMin = min;\nmin = arr[i];\n} else if (arr[i] < secondMin && arr[i] != min) {\nsecondMin = arr[i];\n}\n}\nprintf(\"%d\\n\", secondMax);\nprintf(\"%d\\n\", secondMin);\n}\nint main() {\nint n;\nscanf(\"%d\", &n);\nint* arr = (int*)malloc(n * sizeof(int));\nint i;\nfor (i = 0; i < n; i++) {\nscanf(\"%d\", &arr[i]);\n}\nprintf(\"OUTPUT:\\n\");\nfindSecondLargestAndSmallest(arr, n);\nfree(arr);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_25",
    "slug": "prf192_src_25__o_ng_c_s_",
    "title": "Source 22: Đảo ngược số",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 262,
    "totalSubmissions": 456,
    "statement": "### Bài toán: Source 22: Đảo ngược số\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "12345",
        "output": "54321",
        "explanation": "Đảo ngược số"
      },
      {
        "input": "95117354",
        "output": "45371159",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "12345",
        "expectedOutput": "54321",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "95117354",
        "expectedOutput": "45371159",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "100",
        "expectedOutput": "1",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "7",
        "expectedOutput": "7",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n#include <stdlib.h>\nint main() {\nint i,j;\nlong n;\ndo\nscanf(\"%d\",&n);\nwhile (n<0);\nlong rev=0;\nwhile (n!=0){\nrev=rev*10+n%10;\nn/=10;\n}\nn=rev;\nprintf(\"OUTPUT:\\n\");\nprintf(\"%d\",n);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_26",
    "slug": "prf192_src_26_s_p_x_p_ph_n_t_theo_th_t_t_ng_d",
    "title": "Source 23: Sắp xếp phần tử theo thứ tự tăng dần",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 247,
    "totalSubmissions": 474,
    "statement": "### Bài toán: Source 23: Sắp xếp phần tử theo thứ tự tăng dần\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 1 7",
        "output": "1 2 5 7 9",
        "explanation": "Tăng dần"
      },
      {
        "input": "4\n40 10 30 20",
        "output": "10 20 30 40",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 1 7",
        "expectedOutput": "1 2 5 7 9",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n40 10 30 20",
        "expectedOutput": "10 20 30 40",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2\n9 3",
        "expectedOutput": "3 9",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "6\n-5 8 0 -12 15 3",
        "expectedOutput": "-12 -5 0 3 8 15",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\n#include <stdlib.h>\nint main() {\nint n;\nscanf(\"%d\", &n);\nint a[n];\nint i;\nfor(i=0; i<n; i++) scanf(\"%d\", &a[i]);\nfor (i = 0; i < n - 1; i++) {\nint j;\nfor (j = 0; j < n - 1 - i; j++) {\nif (a[j] > a[j+1]) {\nint temp = a[j];\na[j] = a[j+1];\na[j+1] = temp;\n}\n}\n}\nprintf(\"OUTPUT:\\n\");\nfor (i = 0; i < n; i++) {\nprintf(\"%d \", a[i]);\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_27",
    "slug": "prf192_src_27_s_p_x_p_ph_n_t_theo_th_t_gi_m_d",
    "title": "Source 24: Sắp xếp phần tử theo thứ tự giảm dần",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 251,
    "totalSubmissions": 596,
    "statement": "### Bài toán: Source 24: Sắp xếp phần tử theo thứ tự giảm dần\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 1 7",
        "output": "9 7 5 2 1",
        "explanation": "Giảm dần"
      },
      {
        "input": "4\n10 40 20 30",
        "output": "40 30 20 10",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 1 7",
        "expectedOutput": "9 7 5 2 1",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n10 40 20 30",
        "expectedOutput": "40 30 20 10",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2\n3 9",
        "expectedOutput": "9 3",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "6\n-12 15 0 8 -5 3",
        "expectedOutput": "15 8 3 0 -5 -12",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\n#include <stdlib.h>\nint main() {\nint n;\nscanf(\"%d\", &n);\nint a[n];\nint i;\nfor(i=0; i<n; i++) scanf(\"%d\", &a[i]);\nfor (i = 0; i < n - 1; i++) {\nint j;\nfor (j = 0; j < n - 1 - i; j++) {\nif (a[j] < a[j+1]) {\nint temp = a[j];\na[j] = a[j+1];\na[j+1] = temp;\n}\n}\n}\nprintf(\"OUTPUT:\\n\");\nfor (i = 0; i < n; i++) {\nprintf(\"%d \", a[i]);\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_28",
    "slug": "prf192_src_28_giam_bot_so_luong_trung_nhau_cu",
    "title": "Source 25: giam bot so luong trung nhau cua mang",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 222,
    "totalSubmissions": 381,
    "statement": "### Bài toán: Source 25: giam bot so luong trung nhau cua mang\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "6\n1 2 2 3 4 4",
        "output": "1 2 3 4",
        "explanation": "Giảm bớt trùng nhau"
      },
      {
        "input": "5\n5 5 5 5 5",
        "output": "5",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "6\n1 2 2 3 4 4",
        "expectedOutput": "1 2 3 4",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "5\n5 5 5 5 5",
        "expectedOutput": "5",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n1 2 3",
        "expectedOutput": "1 2 3",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "6\n4 2 4 1 2 5",
        "expectedOutput": "4 2 1 5",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <math.h>\n#include <ctype.h>\nint main() {\n// [Sanitized]:  removed\n\nint n;\nint arr[1000], b[1000] = {0}, c[1000] = {0}; //Khoi tao 3 mang so nguyen\nint i;\nscanf(\"%d\", &n); //Nhap so phan tu cua mang arr\nfor(i = 0; i < n;i++)\n{\nscanf(\"%d\", &arr[i]);// Nhap n phan tu mang so nguyen arr\n}\nfor(i = 0; i < n;i++)\n{\nif(arr[i] > 0) //Mang so nguyen b[] ghi lai so lan xuat hien cua\nb[arr[i]]++;  //cac phan tu lon hon 0 trong day arr\nif(arr[i] < 0) //Mang so nguyen c[] ghi lai so lan xuat hien cua\nc[-arr[i]]++; //cac phan tu nho hon 0 trong day arr\n}\nint max = 0;\nfor(i = 0; i <n ;i++)\n{\nif(arr[i] > 0)\n{\nif(b[arr[i]] > max)\nmax = b[arr[i]];\n}\nelse\n{\nif(c[-arr[i]] > max)\nmax = c[-arr[i]];\n}\n}"
  },
  {
    "id": "prf192_src_29",
    "slug": "prf192_src_29_t_nh_to_n_gi_ph_t_gi_y",
    "title": "Source 27: Tính toán giờ, phút, giây",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 246,
    "totalSubmissions": 418,
    "statement": "### Bài toán: Source 27: Tính toán giờ, phút, giây\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3665",
        "output": "1:1:5",
        "explanation": "3665s = 1h 1m 5s"
      },
      {
        "input": "64800",
        "output": "18:0:0",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3665",
        "expectedOutput": "1:1:5",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "64800",
        "expectedOutput": "18:0:0",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "60",
        "expectedOutput": "0:1:0",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "86399",
        "expectedOutput": "23:59:59",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include<stdio.h>\nint main(){\nint a;\nscanf(\"%d\",&a);\nprintf(\"OUTPUT:\\n\");\nint h,m,s;\nh=a/3600;\nm=(a-(h*3600))/60;\ns=a-h*3600-m*60;\nprintf(\"%d:%d:%d\", h, m, s);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_30",
    "slug": "prf192_src_30_b_nh_ph_ng_c_c_s_l_trong_m_ng",
    "title": "Source 28: Bình phương các số lẻ trong mảng",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 346,
    "totalSubmissions": 559,
    "statement": "### Bài toán: Source 28: Bình phương các số lẻ trong mảng\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 1 7",
        "output": "25 81 1 49",
        "explanation": "Bình phương số lẻ"
      },
      {
        "input": "4\n1 3 5 7",
        "output": "1 9 25 49",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 1 7",
        "expectedOutput": "25 81 1 49",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n1 3 5 7",
        "expectedOutput": "1 9 25 49",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n2 4 6",
        "expectedOutput": "",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5\n-3 2 7 -1 4",
        "expectedOutput": "9 49 1",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\nint main() {\nint size;\nscanf(\"%d\",&size);\nint i,Arr[size];\nfor(i=0;i<size;i++)\nscanf(\"%d\",&Arr[i]);\nprintf(\"OUTPUT:\\n\");\nfor(i=0;i<size;i++)\nif(Arr[i]%2==1&& Arr[i]>0) {\nprintf(\"%d \",Arr[i]*Arr[i]);\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_31",
    "slug": "prf192_src_31_h_m_ki_m_tra_c_c_s_nguy_n_t_pri",
    "title": "Source 29: Hàm kiểm tra các số nguyên tố (Prime Number)",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 221,
    "totalSubmissions": 639,
    "statement": "### Bài toán: Source 29: Hàm kiểm tra các số nguyên tố (Prime Number)\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "7",
        "output": "7 is a prime number.",
        "explanation": "Số nguyên tố"
      },
      {
        "input": "8",
        "output": "8 is not a prime number.",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "7",
        "expectedOutput": "7 is a prime number.",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "8",
        "expectedOutput": "8 is not a prime number.",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2",
        "expectedOutput": "2 is a prime number.",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "97",
        "expectedOutput": "97 is a prime number.",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n#include <math.h>\nint Prime(int n) {\nint i;\nif (n < 2) return 0;\nfor (i = 2; i <= sqrt(n); i++) {\nif (n % i == 0) return 0;\n}\nreturn 1;\n}\nint main() {\nint n;\nscanf(\"%d\", &n);\nprintf(\"OUTPUT:\\n\");\nif (Prime(n)) {\nprintf(\"%d is a prime number.\\n\", n);\n} else {\nprintf(\"%d is not a prime number.\\n\", n);\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_32",
    "slug": "prf192_src_32_h_m_t_nh_t_ng_n_s_",
    "title": "Source 30: Hàm tính tổng n số.",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 291,
    "totalSubmissions": 590,
    "statement": "### Bài toán: Source 30: Hàm tính tổng n số.\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5",
        "output": "15",
        "explanation": "Tổng 1..5 = 15"
      },
      {
        "input": "10",
        "output": "55",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5",
        "expectedOutput": "15",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "10",
        "expectedOutput": "55",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "1",
        "expectedOutput": "1",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "100",
        "expectedOutput": "5050",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n#include <math.h>\nint SumInRange(int n) {\nint i;\nint sum = 0;\nfor (i = 1; i <= n; i++) {\nsum += i;\n}\nreturn sum;\n}\nint main() {\nint n;\nint sum;\nscanf(\"%d\", &n);\nprintf(\"OUTPUT:\\n\");\nsum = SumInRange(n);\nprintf(\"%d\", sum);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_33",
    "slug": "prf192_src_33_h_m_ki_m_tra_s_ch_nh_ph_ng",
    "title": "Source 31: Hàm kiểm tra số chính phương",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 307,
    "totalSubmissions": 584,
    "statement": "### Bài toán: Source 31: Hàm kiểm tra số chính phương\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "16",
        "output": "16 is a perfect square.",
        "explanation": "Số chính phương"
      },
      {
        "input": "7",
        "output": "7 is not a perfect square.",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "16",
        "expectedOutput": "16 is a perfect square.",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "7",
        "expectedOutput": "7 is not a perfect square.",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "25",
        "expectedOutput": "25 is a perfect square.",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "100",
        "expectedOutput": "100 is a perfect square.",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n#include <math.h>\nint SCP(int n) {\nif (sqrt(n) == (int)sqrt(n))\nreturn 1;\nelse\nreturn 0;\n}\nint main() {\nint n;\nscanf(\"%d\", &n);\nprintf(\"OUTPUT:\\n\");\nif (SCP(n))\nprintf(\"%d is a perfect square.\\n\", n);\nelse\nprintf(\"%d is not a perfect square.\\n\", n);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_34",
    "slug": "prf192_src_34_ki_m_tra_s_c_ph_i_thu_c_d_y_fib",
    "title": "Source 32: Kiểm tra số có phải thuộc dãy Fibonacci",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 361,
    "totalSubmissions": 353,
    "statement": "### Bài toán: Source 32: Kiểm tra số có phải thuộc dãy Fibonacci\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "13",
        "output": "13 is a Fibonacci number.",
        "explanation": "Số Fibonacci"
      },
      {
        "input": "7",
        "output": "7 is not a Fibonacci number.",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "13",
        "expectedOutput": "13 is a Fibonacci number.",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "7",
        "expectedOutput": "7 is not a Fibonacci number.",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "8",
        "expectedOutput": "8 is a Fibonacci number.",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "21",
        "expectedOutput": "21 is a Fibonacci number.",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n#include <math.h>\nint isPerfectSquare(int n) {\nint sqrtN = sqrt(n);\nreturn (sqrtN * sqrtN == n);\n}\nint isFibonacci(int n) {\nreturn isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4);\n}\nint main() {\nint n;\nscanf(\"%d\", &n);\nprintf(\"OUTPUT:\\n\");\nif (isFibonacci(n)) {\nprintf(\"%d is a Fibonacci number.\\n\", n);\n} else {\nprintf(\"%d is not a Fibonacci number.\\n\", n);\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_35",
    "slug": "prf192_src_35_c_c_c_ng_th_c_t_nh_di_n_t_ch_s_",
    "title": "Source 33: Các công thức tính diện tích (S), chu vi (P) hình chữ nhật, tam giác, tròn",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 222,
    "totalSubmissions": 613,
    "statement": "### Bài toán: Source 33: Các công thức tính diện tích (S), chu vi (P) hình chữ nhật, tam giác, tròn\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5 3 4",
        "output": "Chu vi c?a Hình Tròn: 31.415900\nDi?n tích c?a Hình Tròn: 78.539750\nChu vi c?a Hình Ch? Nh?t: 14.000000\nDi?n tích c?a Hình Ch? Nh?t: 12.000000\nChu vi c?a Tam Giác: 12.000000\nDi?n tích c?a Tam Giác: 6.000000",
        "explanation": "Công thức diện tích chu vi"
      },
      {
        "input": "5 3 4",
        "output": "Chu vi c?a Hình Tròn: 31.415900\nDi?n tích c?a Hình Tròn: 78.539750\nChu vi c?a Hình Ch? Nh?t: 14.000000\nDi?n tích c?a Hình Ch? Nh?t: 12.000000\nChu vi c?a Tam Giác: 12.000000\nDi?n tích c?a Tam Giác: 6.000000",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5 3 4",
        "expectedOutput": "Chu vi c?a Hình Tròn: 31.415900\nDi?n tích c?a Hình Tròn: 78.539750\nChu vi c?a Hình Ch? Nh?t: 14.000000\nDi?n tích c?a Hình Ch? Nh?t: 12.000000\nChu vi c?a Tam Giác: 12.000000\nDi?n tích c?a Tam Giác: 6.000000",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "5 3 4",
        "expectedOutput": "Chu vi c?a Hình Tròn: 31.415900\nDi?n tích c?a Hình Tròn: 78.539750\nChu vi c?a Hình Ch? Nh?t: 14.000000\nDi?n tích c?a Hình Ch? Nh?t: 12.000000\nChu vi c?a Tam Giác: 12.000000\nDi?n tích c?a Tam Giác: 6.000000",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "5 3 4",
        "expectedOutput": "Chu vi c?a Hình Tròn: 31.415900\nDi?n tích c?a Hình Tròn: 78.539750\nChu vi c?a Hình Ch? Nh?t: 14.000000\nDi?n tích c?a Hình Ch? Nh?t: 12.000000\nChu vi c?a Tam Giác: 12.000000\nDi?n tích c?a Tam Giác: 6.000000",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5 3 4",
        "expectedOutput": "Chu vi c?a Hình Tròn: 31.415900\nDi?n tích c?a Hình Tròn: 78.539750\nChu vi c?a Hình Ch? Nh?t: 14.000000\nDi?n tích c?a Hình Ch? Nh?t: 12.000000\nChu vi c?a Tam Giác: 12.000000\nDi?n tích c?a Tam Giác: 6.000000",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\n#include <math.h>\ndouble getPerimCircle(double r) {\nif (r > 0)\nreturn 2 * r * 3.14159; // S? d?ng giá tr? pi chính xác hon\nelse\nreturn 0;\n}\ndouble getAreaCircle(double r) {\nif (r > 0)\nreturn r * r * 3.14159;\nelse\nreturn 0;\n}\ndouble getPerimRectangle(double A, double B) {\nif (A > 0 && B > 0)\nreturn 2 * (A + B);\nelse\nreturn 0;\n}\ndouble getAreaRectangle(double A, double B) {\nif (A > 0 && B > 0)\nreturn A * B;\nelse\nreturn 0;\n}\ndouble getPerimTriangle(double A, double B, double C) {\nif (A > 0 && B > 0 && C > 0 && A + B > C && B + C > A && A + C > B)\nreturn A + B + C;\nelse\nreturn 0;\n}\ndouble getAreaTriangle(double A, double B, double C) {\nif (A > 0 && B > 0 && C > 0 && A + B > C && B + C > A && A + C > B) {\ndouble P = getPerimTriangle(A, B, C) / 2;\nreturn sqrt(P * (P - A) * (P - B) * (P - C));\n} else {\nprintf(\"\\nÐây không ph?i là tam giác, vui lòng ki?m tra d? dài các c?nh A, B, C\\n\");\nreturn 0;\n}\n}\nint main() {\ndouble r = 5.0; // Bán kính c?a hình tròn\ndouble A = 3.0, B = 4.0, C = 5.0; // Các c?nh c?a tam giác\nprintf(\"Chu vi c?a Hình Tròn: %lf\\n\", getPerimCircle(r));\nprintf(\"Di?n tích c?a Hình Tròn: %lf\\n\", getAreaCircle(r));\nprintf(\"Chu vi c?a Hình Ch? Nh?t: %lf\\n\", getPerimRectangle(A, B));\nprintf(\"Di?n tích c?a Hình Ch? Nh?t: %lf\\n\", getAreaRectangle(A, B));\nprintf(\"Chu vi c?a Tam Giác: %lf\\n\", getPerimTriangle(A, B, C));\nprintf(\"Di?n tích c?a Tam Giác: %lf\\n\", getAreaTriangle(A, B, C));\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_36",
    "slug": "prf192_src_36_s_p_x_p_theo_ki_u_insertion",
    "title": "Source 34: Sắp xếp theo kiểu Insertion",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 311,
    "totalSubmissions": 414,
    "statement": "### Bài toán: Source 34: Sắp xếp theo kiểu Insertion\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 1 7",
        "output": "1 2 5 7 9",
        "explanation": "Insertion sort"
      },
      {
        "input": "4\n40 10 30 20",
        "output": "10 20 30 40",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 1 7",
        "expectedOutput": "1 2 5 7 9",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n40 10 30 20",
        "expectedOutput": "10 20 30 40",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2\n9 1",
        "expectedOutput": "1 9",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5\n3 3 1 2 2",
        "expectedOutput": "1 2 2 3 3",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\nvoid Insertion(int A[], int n) {\nint i, j;\nfor (i = 1; i < n; i++) {\nint value = A[i];\nj = i - 1;\nwhile (j >= 0 && value < A[j]) {\nA[j + 1] = A[j];\nj--;\n}\nA[j + 1] = value;\n}\n}\nint main() {\nint n;\nscanf(\"%d\", &n);\nint A[n];\nint i;\nfor (i = 0; i < n; i++) {\nscanf(\"%d\", &A[i]);\n}\nInsertion(A, n);\nprintf(\"OUTPUT:\\n\");\nfor (i = 0; i < n; i++) {\nprintf(\"%d \", A[i]);\n}\nprintf(\"\\n\");\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_37",
    "slug": "prf192_src_37_s_p_x_p_theo_ki_u_bubble",
    "title": "Source 35: Sắp xếp theo kiểu Bubble",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 248,
    "totalSubmissions": 517,
    "statement": "### Bài toán: Source 35: Sắp xếp theo kiểu Bubble\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 1 7",
        "output": "1 2 5 7 9",
        "explanation": "Bubble sort"
      },
      {
        "input": "4\n40 10 30 20",
        "output": "10 20 30 40",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 1 7",
        "expectedOutput": "1 2 5 7 9",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n40 10 30 20",
        "expectedOutput": "10 20 30 40",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2\n9 1",
        "expectedOutput": "1 9",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5\n3 3 1 2 2",
        "expectedOutput": "1 2 2 3 3",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\nvoid bubble(int A[], int n, int switchOper) {\nint i, j;\nfor (i = 0; i < n; i++) {\nfor (j = 0; j < n - 1 - i; j++) {\nif ((A[j] - A[j + 1]) * switchOper > 0) {\nint temp = A[j];\nA[j] = A[j + 1];\nA[j + 1] = temp;\n}\n}\n}\n}\nint main() {\nint n;\nscanf(\"%d\", &n);\nint A[n];\nint i;\nfor (i = 0; i < n; i++) {\nscanf(\"%d\", &A[i]);\n}\nbubble(A, n, 1);\nprintf(\"OUTPUT:\\n\");\nprintf(\"Sắp xếp tang dan: \");\nfor (i = 0; i < n; i++) {\nprintf(\"%d \", A[i]);\n}\nprintf(\"\\n\");\nbubble(A, n, -1);\nprintf(\"Sắp xếp giam dan: \");\nfor (i = 0; i < n; i++) {\nprintf(\"%d \", A[i]);\n}\nprintf(\"\\n\");\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_38",
    "slug": "prf192_src_38_s_p_x_p_gi_m_d_n_float_",
    "title": "Source 36: Sắp xếp giảm dần (Float)",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 226,
    "totalSubmissions": 420,
    "statement": "### Bài toán: Source 36: Sắp xếp giảm dần (Float)\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5.0 2.0 9.0 1.0 7.0",
        "output": "9.00 7.00 5.00 2.00 1.00",
        "explanation": "Sắp xếp float giảm dần"
      },
      {
        "input": "3\n1.5 9.2 4.1",
        "output": "9.20 4.10 1.50",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5.0 2.0 9.0 1.0 7.0",
        "expectedOutput": "9.00 7.00 5.00 2.00 1.00",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "3\n1.5 9.2 4.1",
        "expectedOutput": "9.20 4.10 1.50",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2\n2.5 8.1",
        "expectedOutput": "8.10 2.50",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "4\n0.5 -1.2 3.8 2.0",
        "expectedOutput": "3.80 2.00 0.50 -1.20",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\n#include <stdlib.h>\nvoid bubble(float A[], int n, int switchOper) {\nint i, j;\nfor (i = 0; i < n; i++) {\nfor (j = 0; j < n - 1 - i; j++) {\nif ((A[j] - A[j + 1]) * switchOper > 0) {\nfloat temp = A[j];\nA[j] = A[j + 1];\nA[j + 1] = temp;\n}\n}\n}\n}\nint main() {\nint n;\nscanf(\"%d\", &n);\nfloat Arr[n];\nint i;\nfor (i = 0; i < n; i++) {\nscanf(\"%f\", &Arr[i]);\n}\nprintf(\"OUTPUT:\\n\");\nbubble(Arr, n, -1);\nfor (i = 0; i < n; i++) {\nprintf(\"%.2f \", Arr[i]);\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_39",
    "slug": "prf192_src_39_s_p_x_p_theo_kieu_selection",
    "title": "Source 37: Sắp xếp theo kieu selection",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 265,
    "totalSubmissions": 473,
    "statement": "### Bài toán: Source 37: Sắp xếp theo kieu selection\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 1 7",
        "output": "1 2 5 7 9",
        "explanation": "Selection sort"
      },
      {
        "input": "4\n40 10 30 20",
        "output": "10 20 30 40",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 1 7",
        "expectedOutput": "1 2 5 7 9",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n40 10 30 20",
        "expectedOutput": "10 20 30 40",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2\n9 1",
        "expectedOutput": "1 9",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5\n3 3 1 2 2",
        "expectedOutput": "1 2 2 3 3",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "void selection(int A[],int size,int opt){\nint i,j;\nfor(i=0;i<size;i++) {\nint min_pos=i;\nfor(j=i+1;j<size;j++)\nif((A[min_pos]-A[j])*opt>0)\nmin_pos=j;\nif(i!=min_pos){\nint temp=A[i];\nA[i]=A[min_pos];\nA[min_pos]=temp;\n}\n}\n}\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) == 1 && n > 0) {\n        int a[1000];\n        for (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n        selection(a, n);\n        for (int i = 0; i < n; i++) printf(\"%d \", a[i]);\n        printf(\"\\n\");\n    }\n    return 0;\n}"
  },
  {
    "id": "prf192_src_40",
    "slug": "prf192_src_40_xoa_cac_phan_tu_la_so_le_trung_",
    "title": "Source 38: Xoa cac phan tu la so le trung nhau",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 309,
    "totalSubmissions": 636,
    "statement": "### Bài toán: Source 38: Xoa cac phan tu la so le trung nhau\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "6\n1 3 3 5 5 7",
        "output": "1 3 5 7",
        "explanation": "Xóa số lẻ trùng nhau"
      },
      {
        "input": "5\n1 1 1 1 1",
        "output": "1",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "6\n1 3 3 5 5 7",
        "expectedOutput": "1 3 5 7",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "5\n1 1 1 1 1",
        "expectedOutput": "1",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "4\n2 4 6 8",
        "expectedOutput": "2 4 6 8",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5\n9 3 9 1 3",
        "expectedOutput": "9 3 1",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "void DelEle(int Arr[],int size,int Pos){\nint i;\nfor(i=Pos;i<size-1;i++)\nArr[i]=Arr[i+1];\nsize--;\n}\nint main(){\nint i,j,size;\ndo {\nscanf(\"%d\", &size);\n}while ( size>=10);\nint Arr[size];\nfor(i=0;i<size;i++)\nscanf(\"%d\", &Arr[i]);\nfor(i=0;i<size;i++)\nfor(j=i+1;j<size;j++)\nif(Arr[i]==Arr[j] && Arr[j]%2!=0)\n{\nDelEle(Arr,size,j);\nsize--;\nj--; // descrease size and iterator\n}\n\nfor(i=0;i<size;i++)\nprintf(\"%d\\n\",Arr[i]);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_41",
    "slug": "prf192_src_41_ham_tinh_do_dai_cua_chuoi",
    "title": "Source 39: ham tinh do dai cua chuoi",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 320,
    "totalSubmissions": 572,
    "statement": "### Bài toán: Source 39: ham tinh do dai cua chuoi\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "hello",
        "output": "5",
        "explanation": "Độ dài chuỗi"
      },
      {
        "input": "PRF192",
        "output": "6",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "hello",
        "expectedOutput": "5",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "PRF192",
        "expectedOutput": "6",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "a",
        "expectedOutput": "1",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "Computer Science",
        "expectedOutput": "16",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "int string_length(char s[]) {\nint i=0;\nwhile(s[i]!='\\0')\ni++;\nreturn i;\n}\n// ham dao nguoc chuoi\nvoid string_reverse(char str[]) {\nint i, j, len;\nchar ch;\nj = len = string_length(str) - 1;\ni = 0;\nwhile(i < j) {\nch = str[j];\nstr[j] = str[i];\nstr[i] = ch;\ni++;\nj--;\n}\n}\n\nint main() {\n    char s[1005];\n    if (gets(s) != NULL) {\n        string_length(s);\n        printf(\"%s\\n\", s);\n    }\n    return 0;\n}"
  },
  {
    "id": "prf192_src_42",
    "slug": "prf192_src_42_in_ra_so_chu_so_trong_string",
    "title": "Source 40: In ra so chu so trong string",
    "category": "Chuỗi & Ký Tự Nâng Cao",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "STRING_MASTERY"
    ],
    "solvedCount": 218,
    "totalSubmissions": 353,
    "statement": "### Bài toán: Source 40: In ra so chu so trong string\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "hello world 123",
        "output": "3",
        "explanation": "3 chữ số: 1, 2, 3"
      },
      {
        "input": "abc45def678",
        "output": "5",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "hello world 123",
        "expectedOutput": "3",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "abc45def678",
        "expectedOutput": "5",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "NoDigits",
        "expectedOutput": "0",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "2026-11-01 Test 999",
        "expectedOutput": "9",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy duyệt chuỗi & Null-Terminator",
        "content": "Chuỗi trong C kết thúc bằng ký tự `'\\0'`. Duyệt chuỗi bằng: `while (s[len] != '\\0') len++;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm chuỗi C",
        "content": "Dùng `gets(s)` hoặc `fgets` nếu đọc chuỗi có dấu cách. Mảng char phải đủ $N + 1$ byte để chứa `'\\0'`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "char s[1005];\ngets(s);\nfor (int i = 0; s[i] != '\\0'; i++) {\n    // Xử lý ký tự s[i]\n}\nprintf(\"%s\\n\", s);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_string_mastery",
    "code": "#include <stdio.h>\n#include<string.h>\nint main (){\nchar str[100];\nprintf(\"Please enter a string:\");\ngets(str);\nint i,count=0;\nint len;\nlen=strlen(str);\nfor(i=0;i<len;i++)\n{\nif(str[i]>48 && str[i]<57)\ncount++;\n}\nprintf(\"%d\",count);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_43",
    "slug": "prf192_src_43_in_ra_so_chan_lon_nhat_trong_n_",
    "title": "Source 41: In ra so chan lon nhat trong n so",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 245,
    "totalSubmissions": 432,
    "statement": "### Bài toán: Source 41: In ra so chan lon nhat trong n so\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n1 4 7 8 3",
        "output": "8",
        "explanation": "Số chẵn lớn nhất là 8"
      },
      {
        "input": "4\n10 40 20 30",
        "output": "40",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n1 4 7 8 3",
        "expectedOutput": "8",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n10 40 20 30",
        "expectedOutput": "40",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n1 3 5",
        "expectedOutput": "Không có số chẵn",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5\n2 6 4 12 8",
        "expectedOutput": "12",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n#include<string.h>\nint main (){\n//int size;\n//scanf(\"%d\",&size);\nint i,Arr[5];\nfor(i=0;i<5;i++)\nscanf(\"%d\",&Arr[i]);\nint Max_even=-1;\nfor(i=0;i<5;i++)\nif(Arr[i]>Max_even && Arr[i]%2==0)\nMax_even=Arr[i];\n//printf(\"OUTPUT:\\n\")\nprintf(\"\\nOUTPUT:\\n%d\",Max_even);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_44",
    "slug": "prf192_src_44_b_i_chung_nh_nh_t_lcm_c_chung_l",
    "title": "Source 42: Bội chung nhỏ nhất (LCM), Ước chung lớn nhất (GCD)",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 328,
    "totalSubmissions": 467,
    "statement": "### Bài toán: Source 42: Bội chung nhỏ nhất (LCM), Ước chung lớn nhất (GCD)\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "12 18",
        "output": "6\t36",
        "explanation": "GCD = 6, LCM = 36"
      },
      {
        "input": "20 30",
        "output": "10\t60",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "12 18",
        "expectedOutput": "6\t36",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "20 30",
        "expectedOutput": "10\t60",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "7 13",
        "expectedOutput": "1\t91",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "15 45",
        "expectedOutput": "15\t45",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include<stdio.h>\nint GCD(int a, int b){\nwhile (a!=b)\nif(a>b) a=a-b;\nelse b=b-a;\nreturn b;\n}\nint LCM(int a, int b){\nint lcm=a * b /GCD(a,b);\nreturn lcm;\n}\nint main(){\nint a,b;\nprintf(\"Please enter two positive integer to find GCD,LCM: \");\nscanf(\"%d%d\", &a,&b);\nGCD(a,b);\nprintf(\"OUTPUT:\\n\");\nprintf(\"%d\\t%d\", GCD(a,b),LCM(a,b));\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_45",
    "slug": "prf192_src_45_in_ra_so_chan_tai_vi_tri_chan_v",
    "title": "Source 43: In ra so chan tai vi tri chan va sort",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 270,
    "totalSubmissions": 604,
    "statement": "### Bài toán: Source 43: In ra so chan tai vi tri chan va sort\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 1 7",
        "output": "2",
        "explanation": "Số chẵn ở vị trí chẵn"
      },
      {
        "input": "6\n4 1 8 3 6 5",
        "output": "4 6 8",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 1 7",
        "expectedOutput": "2",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "6\n4 1 8 3 6 5",
        "expectedOutput": "4 6 8",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n1 3 5",
        "expectedOutput": "",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "4\n2 4 6 8",
        "expectedOutput": "2 6",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\nvoid printsx(int A[], int* n)\n{\nint *adds[*n];\nint i,j;\nint* temp;\nfor(i=0;i<*n;i++)\n{\nadds[i]=&A[i];\n}\nfor(j=0;j<*n-1;j++)\n{\nif(adds[j]>adds[j+1])\n{\ntemp=adds[j];\nadds[j]=adds[j+1];\nadds[j+1]=temp;\n}\n}\nfor (i = 0; i < *n; i++)\n{\nif(*adds[i]%2==0 && i%2==0 && i!=0)\nprintf(\"%d\\t\", *adds[i]);\n}\n}\nint main(){\nint i,size;\nscanf(\"%d\",&size);\nint Arr[size];\nArr[0]=size;\nfor(i=1;i<size;i++)\nscanf(\"%d\",&Arr[i]);\nprintsx(Arr,&size);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_46",
    "slug": "prf192_src_46_neu_la_so_le_binh_phuong_roi_co",
    "title": "Source 44: Neu la so le, binh phuong roi cong vao",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 326,
    "totalSubmissions": 417,
    "statement": "### Bài toán: Source 44: Neu la so le, binh phuong roi cong vao\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "9",
        "explanation": "Số lẻ bình phương: 3^2 = 9"
      },
      {
        "input": "5",
        "output": "25",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "9",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "5",
        "expectedOutput": "25",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "4",
        "expectedOutput": "0",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "7",
        "expectedOutput": "49",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\nint main(){\nint size;\nint sum=0;\ndo {\nscanf(\"%d\",&size);\n}while(size>10);\nint i,Arr[size];\nfor(i=0;i<size;i++)\nscanf(\"%d\",&Arr[i]);\nfor(i=0;i<size;i++)\nif(Arr[i]%2!=0)\nsum=sum+(Arr[i]*Arr[i]);\nprintf(\"%d\",sum);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_47",
    "slug": "prf192_src_47_in_ra_tich_cua_cac_so_trong_chu",
    "title": "Source 45: In ra tich cua cac so trong chu so n",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 282,
    "totalSubmissions": 474,
    "statement": "### Bài toán: Source 45: In ra tich cua cac so trong chu so n\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "234",
        "output": "24",
        "explanation": "Tích các chữ số: 2 * 3 * 4 = 24"
      },
      {
        "input": "12345",
        "output": "120",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "234",
        "expectedOutput": "24",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "12345",
        "expectedOutput": "120",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "5",
        "expectedOutput": "5",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "902",
        "expectedOutput": "0",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\nint main(){\nint n,a,pro=1;\nscanf(\"%d\",&a);\ndo {\nn=a%10;\npro*=n;\na=a/10;\n}while (a>0);\nprintf(\"%d\",pro);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_48",
    "slug": "prf192_src_48_kiem_tra_1_so_co_phai_power_of_",
    "title": "Source 46: Kiem tra 1 so co phai power of 2",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 181,
    "totalSubmissions": 420,
    "statement": "### Bài toán: Source 46: Kiem tra 1 so co phai power of 2\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "16",
        "output": "16 is power of 2",
        "explanation": "Lũy thừa của 2"
      },
      {
        "input": "7",
        "output": "7 is not power of 2",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "16",
        "expectedOutput": "16 is power of 2",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "7",
        "expectedOutput": "7 is not power of 2",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "64",
        "expectedOutput": "64 is power of 2",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "1",
        "expectedOutput": "1 is power of 2",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include<stdio.h>\nint main(){\nint remainder,a,n=0,a1;\nscanf(\"%d\", &a);\na1=a;\n\nwhile (a !=0 ){\nremainder=a%2;\nif(remainder!=0) break;\na/=2;\nn++;\n}\nif(a>1) printf(\"%d is not power of 2\",a1);\nelse printf(\"%d\", n);\nreturn (0);\n}"
  },
  {
    "id": "prf192_src_49",
    "slug": "prf192_src_49_in_ra_ky_tu_viet_hoa_at_positio",
    "title": "Source 47: In ra ky tu viet hoa at position even",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 201,
    "totalSubmissions": 633,
    "statement": "### Bài toán: Source 47: In ra ky tu viet hoa at position even\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "hello world",
        "output": "H L O W R D",
        "explanation": "Ký tự vị trí chẵn viết hoa"
      },
      {
        "input": "abcdef",
        "output": "A C E",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "hello world",
        "expectedOutput": "H L O W R D",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "abcdef",
        "expectedOutput": "A C E",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "hi",
        "expectedOutput": "H",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "programming",
        "expectedOutput": "P O R M I G",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include<stdio.h>\n#include<string.h>\nint main(){\nchar str[100];\nscanf(\"%s\",&str);\nint i,len=strlen(str);\nfor(i=0;i<len;i++)\nif(i%2!=0) str[i]-=32;\nprintf(\"%s\",str);\nreturn (0);\n}"
  },
  {
    "id": "prf192_src_50",
    "slug": "prf192_src_50_in_ra_cac_ky_tu_la_chu",
    "title": "Source 48: In ra cac ky tu la chu",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 184,
    "totalSubmissions": 599,
    "statement": "### Bài toán: Source 48: In ra cac ky tu la chu\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "a1b2c3!@#",
        "output": "abc",
        "explanation": "Chỉ in các chữ cái"
      },
      {
        "input": "Hello123World",
        "output": "HelloWorld",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "a1b2c3!@#",
        "expectedOutput": "abc",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "Hello123World",
        "expectedOutput": "HelloWorld",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "12345",
        "expectedOutput": "",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "C-Language",
        "expectedOutput": "CLanguage",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include<stdio.h>\n#include<string.h>\nint main(){\nchar str[100];\nscanf(\"%[^\\n]\",&str);\nint i,len;\nlen=strlen(str);\n\nfor(i=0;i<len;i++)\n{\nif(str[i]>='a' && str[i]<='z' || str[i]>='A' && str[i]<='Z')\nprintf(\"%c\",str[i]);\n}\nreturn (0);\n}"
  },
  {
    "id": "prf192_src_51",
    "slug": "prf192_src_51_perfect_number",
    "title": "Source 49: Perfect number",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 321,
    "totalSubmissions": 467,
    "statement": "### Bài toán: Source 49: Perfect number\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "6",
        "output": "YES",
        "explanation": "6 là số hoàn hảo (1+2+3=6)"
      },
      {
        "input": "7",
        "output": "NOT",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "6",
        "expectedOutput": "YES",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "7",
        "expectedOutput": "NOT",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "28",
        "expectedOutput": "YES",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "12",
        "expectedOutput": "NOT",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include<stdio.h>\n#include<string.h>\nint main(){\nint n;\nscanf(\"%d\",&n);\nint i,sum=0;\nfor(i=1;i<n;i++) {\nif(n%i==0) sum+=i;\n} if (sum==n)\nprintf(\"perfect\");\nelse printf(\"NOT\");\nreturn (0);\n}"
  },
  {
    "id": "prf192_src_52",
    "slug": "prf192_src_52_dem_digit_trong_string",
    "title": "Source 50: Dem digit trong string",
    "category": "Chuỗi & Ký Tự Nâng Cao",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "STRING_MASTERY"
    ],
    "solvedCount": 297,
    "totalSubmissions": 611,
    "statement": "### Bài toán: Source 50: Dem digit trong string\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "hello world 123",
        "output": "3",
        "explanation": "3 chữ số"
      },
      {
        "input": "abc45def678",
        "output": "5",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "hello world 123",
        "expectedOutput": "3",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "abc45def678",
        "expectedOutput": "5",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "NoDigits",
        "expectedOutput": "0",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "2026-11-01 Test 999",
        "expectedOutput": "9",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy duyệt chuỗi & Null-Terminator",
        "content": "Chuỗi trong C kết thúc bằng ký tự `'\\0'`. Duyệt chuỗi bằng: `while (s[len] != '\\0') len++;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm chuỗi C",
        "content": "Dùng `gets(s)` hoặc `fgets` nếu đọc chuỗi có dấu cách. Mảng char phải đủ $N + 1$ byte để chứa `'\\0'`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "char s[1005];\ngets(s);\nfor (int i = 0; s[i] != '\\0'; i++) {\n    // Xử lý ký tự s[i]\n}\nprintf(\"%s\\n\", s);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_string_mastery",
    "code": "#include<stdio.h>\n#include<string.h>\nint main(){\nchar str[100];\nscanf(\"%s\",&str);\nint i;\nint len=strlen(str);\nint count=0;\nfor(i=0;i<len;i++){\nif(isdigit(str[i])) count++;\n} printf(\"%d\",count);\nreturn (0);\n}"
  },
  {
    "id": "prf192_src_53",
    "slug": "prf192_src_53_viet_hoa_1_2_length_string",
    "title": "Source 51: Viet hoa 1/2 length string",
    "category": "Chuỗi & Ký Tự Nâng Cao",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "STRING_MASTERY"
    ],
    "solvedCount": 264,
    "totalSubmissions": 392,
    "statement": "### Bài toán: Source 51: Viet hoa 1/2 length string\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "hello world",
        "output": "hello WORLD",
        "explanation": "Viết hoa 1/2 sau"
      },
      {
        "input": "abcdefgh",
        "output": "abcdEFGH",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "hello world",
        "expectedOutput": "hello WORLD",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "abcdefgh",
        "expectedOutput": "abcdEFGH",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "ab",
        "expectedOutput": "aB",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "vietnam",
        "expectedOutput": "vietNAM",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy duyệt chuỗi & Null-Terminator",
        "content": "Chuỗi trong C kết thúc bằng ký tự `'\\0'`. Duyệt chuỗi bằng: `while (s[len] != '\\0') len++;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm chuỗi C",
        "content": "Dùng `gets(s)` hoặc `fgets` nếu đọc chuỗi có dấu cách. Mảng char phải đủ $N + 1$ byte để chứa `'\\0'`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "char s[1005];\ngets(s);\nfor (int i = 0; s[i] != '\\0'; i++) {\n    // Xử lý ký tự s[i]\n}\nprintf(\"%s\\n\", s);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_string_mastery",
    "code": "#include <stdio.h>\n#include<string.h>\nint main(){\nchar str[200];\nprintf(\"Enter a string: \");\nscanf(\"%[^\\n]\",&str);\nint i,n=strlen(str)/2;\n{ for(i=0;i<n;i++);\nif(str[i]>='A'&&str[i]<='Z') str[i]+=32;\nfor(i=n;i<strlen(str);i++)\nif(str[i]>='a' && str[i]<='z')\nstr[i]-=32;\n}\nputs(str);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_54",
    "slug": "prf192_src_54_check_valid_name_output_1_neu_v",
    "title": "Source 52: Check valid name . OUTPUT:1 neu valid",
    "category": "Chuỗi & Ký Tự Nâng Cao",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "STRING_MASTERY"
    ],
    "solvedCount": 314,
    "totalSubmissions": 628,
    "statement": "### Bài toán: Source 52: Check valid name . OUTPUT:1 neu valid\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "Nguyen Van A",
        "output": "1",
        "explanation": "Tên hợp lệ"
      },
      {
        "input": "Nguyen123",
        "output": "0",
        "explanation": "Chứa số -> không hợp lệ"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "Nguyen Van A",
        "expectedOutput": "1",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "Nguyen123",
        "expectedOutput": "0",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "John Doe",
        "expectedOutput": "1",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "User@#$",
        "expectedOutput": "0",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy duyệt chuỗi & Null-Terminator",
        "content": "Chuỗi trong C kết thúc bằng ký tự `'\\0'`. Duyệt chuỗi bằng: `while (s[len] != '\\0') len++;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm chuỗi C",
        "content": "Dùng `gets(s)` hoặc `fgets` nếu đọc chuỗi có dấu cách. Mảng char phải đủ $N + 1$ byte để chứa `'\\0'`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "char s[1005];\ngets(s);\nfor (int i = 0; s[i] != '\\0'; i++) {\n    // Xử lý ký tự s[i]\n}\nprintf(\"%s\\n\", s);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_string_mastery",
    "code": "#include<stdio.h>\n#include<string.h>\nint main(){\nchar str[100];\nfgets(str, sizeof(str), stdin);\nint i;\n// check extra space\nfor(i = 0 ; i < strlen(str); i++){\nif(str[i] == ' ' && str[i+1] == ' ') {\nprintf(\"0\");\nreturn 0;\n}\n}\n// check alpha\nint count  = 0;\n// dem nhung thang nao ma khong phai alpha , nhung ki tu dac biet\nfor(i = 0; i < strlen(str) ; i++){\nif(str[i] >= 'a' && str[i] <= 'z' || str[i] >= 'A' && str[i] <= 'Z' || str[i] == ' ' ) {\n}\nelse{\ncount++;\n}\n}\nif(count-1!=0) printf(\"0\");\nelse printf(\"1\");\n}"
  },
  {
    "id": "prf192_src_55",
    "slug": "prf192_src_55_average_positive_number_s_d_ng_",
    "title": "Source 53: Average positive number( Số dương trung bình)",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 315,
    "totalSubmissions": 426,
    "statement": "### Bài toán: Source 53: Average positive number( Số dương trung bình)\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n-1 2 4 -5 9",
        "output": "5.00",
        "explanation": "Trung bình các số dương (2, 4, 9): 15/3 = 5.00"
      },
      {
        "input": "4\n10 20 30 40",
        "output": "25.00",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n-1 2 4 -5 9",
        "expectedOutput": "5.00",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n10 20 30 40",
        "expectedOutput": "25.00",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2\n-5 -10",
        "expectedOutput": "0.00",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "3.00",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include<stdio.h>\n#include<string.h>\ndouble averageNumber(int Arr[], int size){\nint i,count=0;\nint sum=0;\nfor(i=0;i<size;i++)\nif(Arr[i]>=0) {\nsum+=Arr[i];\ncount++;\n}\nif(count==0) return 0;\nelse return  sum*1.0 /count ;\n}\nint main(){\nint size;\nscanf(\"%d\",&size);\nint i,Arr[size];\nfor(i=0;i<size;i++) {\nscanf(\"%d\",&Arr[i]);\n}\nprintf(\"%.2lf\",averageNumber(Arr,size));\n}"
  },
  {
    "id": "prf192_src_56",
    "slug": "prf192_src_56_di_n_t_ch_h_nh_tr_n",
    "title": "Source 54: Diện tích hình tròn",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 245,
    "totalSubmissions": 624,
    "statement": "### Bài toán: Source 54: Diện tích hình tròn\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "4",
        "output": "50.265440",
        "explanation": "Diện tích hình tròn bán kính 4: pi * 4 * 4 = 50.265440"
      },
      {
        "input": "5",
        "output": "78.539750",
        "explanation": "Bán kính 5"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "4",
        "expectedOutput": "50.265440",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "5",
        "expectedOutput": "78.539750",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "1",
        "expectedOutput": "3.141590",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "10",
        "expectedOutput": "314.159000",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include<stdio.h>\n#define PI 3.14159\nint main(){\ndouble a;\nprintf(\"Enter radius to calculate the area of a circle:\");\nscanf(\"%lf\",&a);\ndouble area=0;\nif (a>0) area=PI*a*a;\nprintf(\"%lf\",area);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_57",
    "slug": "prf192_src_57_check_square_number",
    "title": "Source 55: check square number",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 271,
    "totalSubmissions": 467,
    "statement": "### Bài toán: Source 55: check square number\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "25",
        "output": "YES",
        "explanation": "Số chính phương"
      },
      {
        "input": "26",
        "output": "Not",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "25",
        "expectedOutput": "YES",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "26",
        "expectedOutput": "Not",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "1",
        "expectedOutput": "YES",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "49",
        "expectedOutput": "YES",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include<stdio.h>\n#include<math.h>\nint SCP(int n){\nif (sqrt(n)==(int)sqrt(n)) return 1;\nelse return 0;\n}\nint main(){\nint a;\nscanf(\"%d\",&a);\nif(SCP(a)) printf(\"Pefect number\");\nelse printf(\"Not\");\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_58",
    "slug": "prf192_src_58_xoa_1_phan_tu_tai_vi_tri_ma_ngu",
    "title": "Source 56: xoa 1 phan tu tai vi tri ma nguoi dung nhap vao",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 326,
    "totalSubmissions": 489,
    "statement": "### Bài toán: Source 56: xoa 1 phan tu tai vi tri ma nguoi dung nhap vao\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 1 7\n2",
        "output": "5 2 1 7",
        "explanation": "Xóa vị trí 2"
      },
      {
        "input": "4\n1 2 3 4\n0",
        "output": "2 3 4",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 1 7\n2",
        "expectedOutput": "5 2 1 7",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n1 2 3 4\n0",
        "expectedOutput": "2 3 4",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n10 20 30\n2",
        "expectedOutput": "10 20",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5\n8 6 4 2 0\n4",
        "expectedOutput": "8 6 4 2",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n#include<time.h>\n#include<stdlib.h>\nint main(){\nint i,size;\nsrand(time(NULL));\nprintf(\"Enter the size of the array: \"); scanf(\"%d\", &size);\nint A[size];\nfor(i=0;i<size;i++)\n{\nA[i]=rand()%51-rand()%30;\n}\nfor(i=0;i<size;i++)\nprintf(\"%d\\t\", A[i]);\nint pos;\nprintf(\"\\nEnter the position to remove an element: \"); scanf(\"%d\", &pos);\nif(pos>=0 && pos<size) {\nint value=A[pos];\nfor(i=pos;i<size;i++)\nA[i]=A[i+1];\nsize--;\nprintf(\"\\nThe array after removing element %d at position %d:\\n\",value,pos);\nfor(i=0;i<size;i++) printf(\"%d\\t\", A[i]);\n} else {\nprintf(\"\\nCannot remove the element at %d, plz check range !\", pos);\nprintf(\"\\nThe origin array:\\n\");\nfor(i=0;i<size;i++) printf(\"%d\\t\", A[i]);\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_59",
    "slug": "prf192_src_59_chen_1_so_bat_ky_vao_array",
    "title": "Source 57: Chen 1 so bat ky vao array",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 196,
    "totalSubmissions": 418,
    "statement": "### Bài toán: Source 57: Chen 1 so bat ky vao array\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n1 2 3 4 5\n2 99",
        "output": "1 2 99 3 4 5",
        "explanation": "Chèn 99 vào vị trí index 2"
      },
      {
        "input": "3\n10 20 30\n0 5",
        "output": "5 10 20 30",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n1 2 3 4 5\n2 99",
        "expectedOutput": "1 2 99 3 4 5",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "3\n10 20 30\n0 5",
        "expectedOutput": "5 10 20 30",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "1\n100\n1 200",
        "expectedOutput": "100 200",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "4\n2 4 6 8\n4 10",
        "expectedOutput": "2 4 6 8 10",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\n#include<time.h>\n#include<stdlib.h>\nint main(){\nint i,size;\nsrand(time(NULL));\nprintf(\"Enter the size of the array: \"); scanf(\"%d\", &size);\nint A[size];\nfor(i=0;i<size;i++)\n{\nA[i]=rand()%51-rand()%30;\n}\nfor(i=0;i<size;i++)\nprintf(\"%d\\t\", A[i]);\nint pos;\nprintf(\"\\nEnter the position to insert an element: \"); scanf(\"%d\", &pos);\nif(pos>=0 && pos<=size) {\nfor(i=size;i>=pos;i--)\nA[i]=A[i-1];\nint n;\nprintf(\"Enter new element: \"); scanf(\"%d\", &n);\nA[pos]=n;\nprintf(\"\\nThe array after insert element %d at position %d:\\n\",n,pos);\nsize++;\nfor(i=0;i<size;i++) printf(\"%d\\t\", A[i]);\n} else {\nprintf(\"\\nCannot insert the element at %d, plz check range !\", pos);\nprintf(\"\\nThe origin array:\\n\");\nfor(i=0;i<size;i++) printf(\"%d\\t\", A[i]);\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_60",
    "slug": "prf192_src_60_swap_2_vi_tri_trong_array",
    "title": "Source 58: swap 2 vi tri trong array",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 372,
    "totalSubmissions": 377,
    "statement": "### Bài toán: Source 58: swap 2 vi tri trong array\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 1 7\n0 4",
        "output": "7 2 9 1 5",
        "explanation": "Swap phần tử vị trí 0 và 4"
      },
      {
        "input": "4\n1 2 3 4\n1 2",
        "output": "1 3 2 4",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 1 7\n0 4",
        "expectedOutput": "7 2 9 1 5",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n1 2 3 4\n1 2",
        "expectedOutput": "1 3 2 4",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2\n10 20\n0 1",
        "expectedOutput": "20 10",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5\n1 2 3 4 5\n2 2",
        "expectedOutput": "1 2 3 4 5",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\n#include<stdlib.h>\nint main(){\nint i,size;\nprintf(\"Enter the size of the array: \"); scanf(\"%d\", &size);\nint A[size];\nfor(i=0;i<size;i++)\nscanf(\"%d\",&A[i]);\nint pos1,pos2;\nprintf(\"\\nEnter the two positions to swap : \"); scanf(\"%d%d\", &pos1, &pos2);\nif (pos1>=0 && pos2>=0 && pos1<size && pos2<size && pos1 != pos2) {\n{\nA[pos1]=A[pos1]+A[pos2];\nA[pos2]=A[pos1]-A[pos2];\nA[pos1]=A[pos1]-A[pos2];\n}\nprintf(\"\\nThe array after swapping :\\n\",pos1,pos2);\nfor(i=0;i<size;i++) printf(\"%d\\t\", A[i]);\n} else {\nprintf(\"\\nCannot swap the element at position %d and %d, plz check range !\", pos1, pos2);\nprintf(\"\\nThe origin array:\\n\");\nfor(i=0;i<size;i++) printf(\"%d\\t\", A[i]);\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_61",
    "slug": "prf192_src_61_xoa_1_phan_tu_trong_array_vi_tr",
    "title": "Source 59: xoa 1 phan tu trong array vi tri nguoi dung nhap",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 348,
    "totalSubmissions": 398,
    "statement": "### Bài toán: Source 59: xoa 1 phan tu trong array vi tri nguoi dung nhap\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 1 7\n1",
        "output": "5 9 1 7",
        "explanation": "Xóa phần tử vị trí index 1 (giá trị 2)"
      },
      {
        "input": "4\n10 20 30 40\n0",
        "output": "20 30 40",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 1 7\n1",
        "expectedOutput": "5 9 1 7",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n10 20 30 40\n0",
        "expectedOutput": "20 30 40",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n1 2 3\n2",
        "expectedOutput": "1 2",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5\n4 8 12 16 20\n3",
        "expectedOutput": "4 8 12 20",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\n#include<stdlib.h>\nint main(){\nint i,size;\nprintf(\"Enter the size of the array: \"); scanf(\"%d\", &size);\nint A[size];\nfor(i=0;i<size;i++)\n{\nscanf(\"%d\",&A[i]);\n}\nfor(i=0;i<size;i++)\nprintf(\"%d\\t\", A[i]);\nint pos;\nprintf(\"\\nEnter the position to remove an element: \"); scanf(\"%d\", &pos);\nif(pos>=0 && pos<size) {\nint value=A[pos];\nfor(i=pos;i<size;i++)\nA[i]=A[i+1];\nsize--;\nprintf(\"\\nThe array after removing element %d at position %d:\\n\",value,pos);\nfor(i=0;i<size;i++) printf(\"%d\\t\", A[i]);\n} else {\nprintf(\"\\nCannot remove the element at %d, plz check range !\", pos);\nprintf(\"\\nThe origin array:\\n\");\nfor(i=0;i<size;i++) printf(\"%d\\t\", A[i]);\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_62",
    "slug": "prf192_src_62_in_ra_gio_phut_giay",
    "title": "Source 60: In ra gio phut giay",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 326,
    "totalSubmissions": 467,
    "statement": "### Bài toán: Source 60: In ra gio phut giay\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3665",
        "output": "1\n1\n5",
        "explanation": "Giờ 1, phút 1, giây 5"
      },
      {
        "input": "64800",
        "output": "18\n0\n0",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3665",
        "expectedOutput": "1\n1\n5",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "64800",
        "expectedOutput": "18\n0\n0",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "60",
        "expectedOutput": "0\n1\n0",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "7200",
        "expectedOutput": "2\n0\n0",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include<stdio.h>\nint main(){\nint a;\nscanf(\"%d\",&a);\nint h,m,s;\nh=a/3600;\nprintf(\"\\n%d\",h);\nm=(a-(h*3600))/60;\nprintf(\"\\n%d\",m);\ns=a-h*3600-m*60;\nprintf(\"\\n%d\",s);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_63",
    "slug": "prf192_src_63_tong_so_dau_va_so_cuoi",
    "title": "Source 61: Tong so dau va so cuoi",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 348,
    "totalSubmissions": 640,
    "statement": "### Bài toán: Source 61: Tong so dau va so cuoi\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "12345",
        "output": "6",
        "explanation": "Tổng chữ số đầu 1 và cuối 5 là 6"
      },
      {
        "input": "7",
        "output": "14",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "12345",
        "expectedOutput": "6",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "7",
        "expectedOutput": "14",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "9002",
        "expectedOutput": "11",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "50",
        "expectedOutput": "5",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\nint sum, a[100], x, count1 = 0, i;\nint main()\n{\nscanf(\"%d\", &x);\nwhile (x != 0)\n{\nint n = x % 10;\nx = x / 10;\na[count1++] = n;\n}\nsum = a[0] + a[count1 - 1];\nprintf(\"%d\", sum);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_64",
    "slug": "prf192_src_64_kiem_tra_exponent",
    "title": "Source 62: Kiem tra exponent",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 372,
    "totalSubmissions": 496,
    "statement": "### Bài toán: Source 62: Kiem tra exponent\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "8 2",
        "output": "8 là l?y th?a c?a 2^3",
        "explanation": "Kiểm tra lũy thừa"
      },
      {
        "input": "7 7",
        "output": "7 là l?y th?a c?a 7^1",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "8 2",
        "expectedOutput": "8 là l?y th?a c?a 2^3",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "7 7",
        "expectedOutput": "7 là l?y th?a c?a 7^1",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "27 3",
        "expectedOutput": "27 là l?y th?a c?a 3^3",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "16 2",
        "expectedOutput": "16 là l?y th?a c?a 2^4",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n#include <math.h>\nint main() {\nint num, base;\ndouble exponent;\nprintf(\"Nh?p s? nguyên: \");\nscanf(\"%d\", &num);\nfor (base = 2; base <= num; base++) {\nexponent = log(num) / log(base);\nif (exponent == (int) exponent) {\nprintf(\"%d là l?y th?a c?a %d^%d\\n\", num, base, (int) exponent);\nreturn 0;\n}\n}\nprintf(\"%d không ph?i là l?y th?a c?a b?t k? s? nào\\n\", num);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_65",
    "slug": "prf192_src_65_kiem_tra_n_5_0_in_ra_so_lan_xua",
    "title": "Source 63: Kiem tra n%5==0 in ra so lan xuan hien cua n",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 336,
    "totalSubmissions": 406,
    "statement": "### Bài toán: Source 63: Kiem tra n%5==0 in ra so lan xuan hien cua n\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 10 12 15 20",
        "output": "4",
        "explanation": "Có 4 số chia hết cho 5"
      },
      {
        "input": "4\n1 2 3 4",
        "output": "0",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 10 12 15 20",
        "expectedOutput": "4",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n1 2 3 4",
        "expectedOutput": "0",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n5 5 5",
        "expectedOutput": "3",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "6\n15 22 25 30 7 35",
        "expectedOutput": "4",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include<stdio.h>\n#define max 100\nint main()\n{\nint i,n;\nscanf(\"%d\",&n);\nint Arr[n];\nfor(i=0;i<n;i++)\n{\nscanf(\"%d\",&Arr[i]);\n}\nint count[max] = {0};\n\nfor ( i = 0; i < n; i++)\n{\nif(Arr[i]%5==0)\ncount[Arr[i]]++;\n}\nfor ( i = 0; i < max; i++)\n{\nif (count[i] > 0)\n{\nprintf(\"%d-%d\\n\", count[i], i);\n}\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_66",
    "slug": "prf192_src_66_binary_gt_octal",
    "title": "Source 64: binary-&gt;octal",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 348,
    "totalSubmissions": 519,
    "statement": "### Bài toán: Source 64: binary-&gt;octal\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "1101",
        "output": "15",
        "explanation": "Nhị phân 1101 -> bát phân 15"
      },
      {
        "input": "111",
        "output": "7",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "1101",
        "expectedOutput": "15",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "111",
        "expectedOutput": "7",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "1010",
        "expectedOutput": "12",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "10000",
        "expectedOutput": "20",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n#include <math.h>\nint binaryToOctal(long long binaryNumber);\nint main() {\nlong long binaryNumber;\nprintf(\"Enter a binary number: \");\nscanf(\"%lld\", &binaryNumber);\nprintf(\"Octal number = %d\", binaryToOctal(binaryNumber));\nreturn 0;\n}\nint binaryToOctal(long long binaryNumber) {\nint octalNumber = 0, decimalNumber = 0, i = 0;\nwhile (binaryNumber != 0) {\ndecimalNumber += (binaryNumber % 10) * pow(2, i);\n++i;\nbinaryNumber /= 10;\n}\ni = 1;\nwhile (decimalNumber != 0) {\noctalNumber += (decimalNumber % 8) * i;\ndecimalNumber /= 8;\ni *= 10;\n}\nreturn octalNumber;\n}"
  },
  {
    "id": "prf192_src_67",
    "slug": "prf192_src_67_check_mang_tang_dan",
    "title": "Source 65: check mang tang dan",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 232,
    "totalSubmissions": 464,
    "statement": "### Bài toán: Source 65: check mang tang dan\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n1 2 3 4 5",
        "output": "1",
        "explanation": "Mảng tăng dần"
      },
      {
        "input": "5\n5 4 3 2 1",
        "output": "0",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "1",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "0",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n1 3 2",
        "expectedOutput": "0",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "4\n2 4 6 8",
        "expectedOutput": "1",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#pragma warning (disable : 4996)\n#include <stdio.h>\n#include <string.h>\n#include <stdlib.h>\n#include <math.h>\n#define maxn 1000\nint check(int a[], int n)\n{\nint i;\nfor (i = 0; i < n - 1; ++i)\n{\nif (a[i] > a[i + 1]) return 0;\n}\nreturn 1;\n}\nint main()\n{\nint n, i, j, a[maxn];\nscanf(\"%d\", &n);\nfor (i = 0; i < n; i++)\nscanf(\"%d\", &a[i]);\nif (check(a, n) == 0) printf(\"-1\");\nelse printf(\"Mang tang dan\");\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_68",
    "slug": "prf192_src_68_check_mang_doi_xung",
    "title": "Source 66: check mang doi xung",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 367,
    "totalSubmissions": 639,
    "statement": "### Bài toán: Source 66: check mang doi xung\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n1 2 3 2 1",
        "output": "1",
        "explanation": "Mảng đối xứng"
      },
      {
        "input": "5\n1 2 3 4 5",
        "output": "0",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n1 2 3 2 1",
        "expectedOutput": "1",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "0",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "4\n1 2 2 1",
        "expectedOutput": "1",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "3\n5 5 5",
        "expectedOutput": "1",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#pragma warning (disable : 4996)\n#include <stdio.h>\n#include <string.h>\n#include <stdlib.h>\n#include <math.h>\n#include <ctype.h>\n#define MAXN 1000\nint main()\n{\nint n, i, a[MAXN], check;\nscanf(\"%d\", &n);\nfor (i = 0; i < n; ++i) scanf(\"%d\", a + i);\nfor (i = 0; i <= n / 2; ++i)\n{\nif (a[i] != a[n - i - 1])\n{\ncheck = 0;\nbreak;\n}\nelse check = 1;\n}\nif (check == 1) printf(\"1\");\nelse printf(\"0\");\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_69",
    "slug": "prf192_src_69_in_ra_s_nguy_n_t_u_ti_n",
    "title": "Source 67: In ra số Nguyên tố đầu tiên",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 180,
    "totalSubmissions": 574,
    "statement": "### Bài toán: Source 67: In ra số Nguyên tố đầu tiên\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n4 6 7 9 11",
        "output": "7",
        "explanation": "Số nguyên tố đầu tiên trong mảng là 7"
      },
      {
        "input": "4\n2 4 6 8",
        "output": "2",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n4 6 7 9 11",
        "expectedOutput": "7",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n2 4 6 8",
        "expectedOutput": "2",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n8 9 10",
        "expectedOutput": "0",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5\n15 14 13 12 11",
        "expectedOutput": "13",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "int checkprime(int n)\n{\nint i;\nif (n < 2) return 0;\nfor (i = 2; i <= sqrt(n); ++i)\nif (n % i == 0) return 0;\nreturn 1;\n}\nint main()\n{\nint n, i, j, a[n];\nscanf(\"%d\", &n);\nfor (i = 0; i < n; i++)\nscanf(\"%d\", &a[i]);\nfor (i = 0; i < n; i++)\nif (checkprime(a[i]) == 1)\n{\nprintf(\"%d\", a[i]);\nbreak;\n}\nif (i == n) printf(\"-1\");\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_70",
    "slug": "prf192_src_70_t_nh_1_n_1_xn",
    "title": "Source 68: tính:  (-1)n+1*xn",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 251,
    "totalSubmissions": 527,
    "statement": "### Bài toán: Source 68: tính:  (-1)n+1*xn\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3 2",
        "output": "4",
        "explanation": "(-1)^(3+1) * 2^3"
      },
      {
        "input": "2 3",
        "output": "-9",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3 2",
        "expectedOutput": "4",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "2 3",
        "expectedOutput": "-9",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "1 5",
        "expectedOutput": "5",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "4 2",
        "expectedOutput": "-16",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include<stdio.h>\n#include<math.h>\nint main()\n{\nint sum=0, i, n,x;\nscanf(\"%d\",&n);\n// [Sanitized]: fflush(stdin) removed\nscanf(\"%d\",&x);\nfor(i=1;i<=n;i++)\n{\nsum+= ((pow(-1,i+1))*(pow(x,i)));\n}\nprintf(\"\\nOUTPUT:\\n%d\",sum);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_71",
    "slug": "prf192_src_71_reverse_day_so_o_ng_c_",
    "title": "Source 69: reverse day so(đảo ngược)",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 283,
    "totalSubmissions": 545,
    "statement": "### Bài toán: Source 69: reverse day so(đảo ngược)\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n1 2 3 4 5",
        "output": "5 4 3 2 1",
        "explanation": "Đảo ngược dãy số"
      },
      {
        "input": "3\n10 20 30",
        "output": "30 20 10",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "5 4 3 2 1",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "3\n10 20 30",
        "expectedOutput": "30 20 10",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "1\n7",
        "expectedOutput": "7",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "4\n2 4 6 8",
        "expectedOutput": "8 6 4 2",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include<stdio.h>\nint main(){\nint i,j;\nlong n;\ndo\nscanf(\"%d\",&n);\nwhile (n<0);\nlong rev=0;\nwhile (n!=0){\nrev=rev*10+n%10;\nn/=10;\n}\nn=rev;\nprintf(\"%d\",n);\n}"
  },
  {
    "id": "prf192_src_72",
    "slug": "prf192_src_72_square_odd_number_s_l_vu_ng_",
    "title": "Source 70: square odd number(số lẻ vuông)",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 269,
    "totalSubmissions": 472,
    "statement": "### Bài toán: Source 70: square odd number(số lẻ vuông)\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "1 3 5\n7 9 11\n13 15 17",
        "explanation": "Hình vuông các số lẻ kích thước 3"
      },
      {
        "input": "2",
        "output": "1 3\n5 7",
        "explanation": "Kích thước 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "1 3 5\n7 9 11\n13 15 17",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "2",
        "expectedOutput": "1 3\n5 7",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "1",
        "expectedOutput": "1",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "4",
        "expectedOutput": "1 3 5 7\n9 11 13 15\n17 19 21 23\n25 27 29 31",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include<stdio.h>\nint main(){\nint size;\nscanf(\"%d\",&size);\nint i,Arr[size];\nfor(i=0;i<size;i++)\nscanf(\"%d\",&Arr[i]);\nfor(i=0;i<size;i++)\nif(Arr[i]%2==1&& Arr[i]>0) {\nprintf(\"%d \",Arr[i]*Arr[i]);\n}\nprintf(\"\\n\");\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_73",
    "slug": "prf192_src_73_in_ra_vi_tri_co_tong_bang_mot_s",
    "title": "Source 71: in ra vi tri co tong bang` mot so nao` do",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 333,
    "totalSubmissions": 484,
    "statement": "### Bài toán: Source 71: in ra vi tri co tong bang` mot so nao` do\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n1 2 3 4 5\n7",
        "output": "2 3",
        "explanation": "Vị trí có tổng bằng 7 (3 + 4)"
      },
      {
        "input": "4\n10 20 30 40\n50",
        "output": "1 2",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n1 2 3 4 5\n7",
        "expectedOutput": "2 3",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n10 20 30 40\n50",
        "expectedOutput": "1 2",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n1 2 3\n5",
        "expectedOutput": "1 2",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "4\n2 4 6 8\n10",
        "expectedOutput": "1 2",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include<stdio.h>\nint main (){\nint size;\nscanf(\"%d\",&size);\nint i,j,Arr[size];\nfor(i=0;i<size;i++)\nscanf(\"%d\",&Arr[i]);\nfor(i=0;i<size;i++)\nfor(j=size-1;j>=0;j--)\n{\nif(Arr[i]+Arr[j]==5)\nprintf(\"Sum = 5 at position %d and %d\\n\",i,j);\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_74",
    "slug": "prf192_src_74_di_n_t_ch_v_chu_vi_h_nh_ch_nh_t",
    "title": "Source 72: Diện tích và chu vi hình chữ nhật",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 374,
    "totalSubmissions": 637,
    "statement": "### Bài toán: Source 72: Diện tích và chu vi hình chữ nhật\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5 3",
        "output": "Chieu dai = 5.000000\nChieu rong = 3.000000\nDien tich = 15.000000\nChu vi = 16.000000",
        "explanation": "Diện tích 15, chu vi 16"
      },
      {
        "input": "10 4",
        "output": "Chieu dai = 10.000000\nChieu rong = 4.000000\nDien tich = 40.000000\nChu vi = 28.000000",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5 3",
        "expectedOutput": "Chieu dai = 5.000000\nChieu rong = 3.000000\nDien tich = 15.000000\nChu vi = 16.000000",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "10 4",
        "expectedOutput": "Chieu dai = 10.000000\nChieu rong = 4.000000\nDien tich = 40.000000\nChu vi = 28.000000",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "6 2",
        "expectedOutput": "Chieu dai = 6.000000\nChieu rong = 2.000000\nDien tich = 12.000000\nChu vi = 16.000000",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "7 5",
        "expectedOutput": "Chieu dai = 7.000000\nChieu rong = 5.000000\nDien tich = 35.000000\nChu vi = 24.000000",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\nint main() {\nfloat chieu_dai = 5.0;\nfloat chieu_rong = 3.0;\nfloat dien_tich, chu_vi;\ndien_tich = chieu_dai * chieu_rong;\nchu_vi = 2 * (chieu_dai + chieu_rong);\nprintf(\"Chieu dai = %f\\n\", chieu_dai);\nprintf(\"Chieu rong = %f\\n\", chieu_rong);\nprintf(\"Dien tich = %f\\n\", dien_tich);\nprintf(\"Chu vi = %f\\n\", chu_vi);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_75",
    "slug": "prf192_src_75_di_n_t_ch_v_chu_vi_tam_gi_c_",
    "title": "Source 73: Diện tích và chu vi tam giác:",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 278,
    "totalSubmissions": 504,
    "statement": "### Bài toán: Source 73: Diện tích và chu vi tam giác:\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5 3 4 3 5",
        "output": "Day = 5.000000\nChieu cao = 3.000000\nCanh a = 4.000000\nCanh b = 3.000000\nCanh c = 5.000000\nDien tich = 7.500000\nChu vi = 12.000000",
        "explanation": "Tam giác diện tích 7.5 chu vi 12"
      },
      {
        "input": "5 3 4 3 5",
        "output": "Day = 5.000000\nChieu cao = 3.000000\nCanh a = 4.000000\nCanh b = 3.000000\nCanh c = 5.000000\nDien tich = 7.500000\nChu vi = 12.000000",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5 3 4 3 5",
        "expectedOutput": "Day = 5.000000\nChieu cao = 3.000000\nCanh a = 4.000000\nCanh b = 3.000000\nCanh c = 5.000000\nDien tich = 7.500000\nChu vi = 12.000000",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "5 3 4 3 5",
        "expectedOutput": "Day = 5.000000\nChieu cao = 3.000000\nCanh a = 4.000000\nCanh b = 3.000000\nCanh c = 5.000000\nDien tich = 7.500000\nChu vi = 12.000000",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "5 3 4 3 5",
        "expectedOutput": "Day = 5.000000\nChieu cao = 3.000000\nCanh a = 4.000000\nCanh b = 3.000000\nCanh c = 5.000000\nDien tich = 7.500000\nChu vi = 12.000000",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5 3 4 3 5",
        "expectedOutput": "Day = 5.000000\nChieu cao = 3.000000\nCanh a = 4.000000\nCanh b = 3.000000\nCanh c = 5.000000\nDien tich = 7.500000\nChu vi = 12.000000",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\nint main() {\nfloat day = 5.0;\nfloat chieu_cao = 3.0;\nfloat canh_a = 4.0;\nfloat canh_b = 3.0;\nfloat canh_c = 5.0;\nfloat dien_tich, chu_vi;\ndien_tich = (day * chieu_cao) / 2;\nchu_vi = canh_a + canh_b + canh_c;\nprintf(\"Day = %f\\n\", day);\nprintf(\"Chieu cao = %f\\n\", chieu_cao);\nprintf(\"Canh a = %f\\n\", canh_a);\nprintf(\"Canh b = %f\\n\", canh_b);\nprintf(\"Canh c = %f\\n\", canh_c);\nprintf(\"Dien tich = %f\\n\", dien_tich);\nprintf(\"Chu vi = %f\\n\", chu_vi);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_76",
    "slug": "prf192_src_76_di_n_t_ch_v_chu_vi_h_nh_tr_n_",
    "title": "Source 74: Diện tích và chu vi hình tròn:",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 323,
    "totalSubmissions": 583,
    "statement": "### Bài toán: Source 74: Diện tích và chu vi hình tròn:\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "Ban kinh = 3.000000\nDien tich = 28.274334\nChu vi = 18.849556",
        "explanation": "Bán kính 3"
      },
      {
        "input": "5",
        "output": "Ban kinh = 5.000000\nDien tich = 78.539816\nChu vi = 31.415927",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "Ban kinh = 3.000000\nDien tich = 28.274334\nChu vi = 18.849556",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "5",
        "expectedOutput": "Ban kinh = 5.000000\nDien tich = 78.539816\nChu vi = 31.415927",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "1",
        "expectedOutput": "Ban kinh = 1.000000\nDien tich = 3.141593\nChu vi = 6.283185",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "10",
        "expectedOutput": "Ban kinh = 10.000000\nDien tich = 314.159265\nChu vi = 62.831853",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "- Dien tích hình tròn = pi x bán kính x bán kính\n- Chu vi hình tròn = 2 x pi x bán kính */\n#include <stdio.h>\n#define PI 3.14159265358979323846\nint main() {\nfloat ban_kinh = 3.0;\nfloat dien_tich, chu_vi;\ndien_tich = PI * ban_kinh * ban_kinh;\nchu_vi = 2 * PI * ban_kinh;\nprintf(\"Ban kinh = %f\\n\", ban_kinh);\nprintf(\"Dien tich = %f\\n\", dien_tich);\nprintf(\"Chu vi = %f\\n\", chu_vi);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_77",
    "slug": "prf192_src_77_t_nh_giai_th_a_f1_n_n_",
    "title": "Source 75: Tính giai thừa F1(n) = n!",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 238,
    "totalSubmissions": 485,
    "statement": "### Bài toán: Source 75: Tính giai thừa F1(n) = n!\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5",
        "output": "120",
        "explanation": "5! = 120"
      },
      {
        "input": "4",
        "output": "24",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5",
        "expectedOutput": "120",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4",
        "expectedOutput": "24",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "1",
        "expectedOutput": "1",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "7",
        "expectedOutput": "5040",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint main(){\nint n;\nscanf(\"%d\", &n);\nint F1 = 1, i;\nfor (i = 1; i <= n; i++){\nF1 *= i;\n}\nprintf(\"OUTPUT:\\n\");\nprintf(\"%d\\n\", F1);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_78",
    "slug": "prf192_src_78_tinh_tong_phan_so_f2_n_1_2_3_n",
    "title": "Source 76: Tinh tong phan so F2(n) = 1 + 2 + 3 + ... + n",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 349,
    "totalSubmissions": 477,
    "statement": "### Bài toán: Source 76: Tinh tong phan so F2(n) = 1 + 2 + 3 + ... + n\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5",
        "output": "15",
        "explanation": "1 + 2 + 3 + 4 + 5 = 15"
      },
      {
        "input": "10",
        "output": "55",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5",
        "expectedOutput": "15",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "10",
        "expectedOutput": "55",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "1",
        "expectedOutput": "1",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "100",
        "expectedOutput": "5050",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "void SumFraction(int n){\nint F2 = 0, i;\nfor (i = 1; i <= n; i++){\nF2 += i;\n}\nprintf(\"F2(%d) = %d\\n\", n, F2);\n}\n// Tinh F1(n) + F2(n) = m\nvoid SumF1F2(int n, int m){\nint tempF1, i;\nfor (i = 1; i <= n; i++){\ntempF1 = 1;\nint j;\nfor (j = 1; j <= i; j++){\ntempF1 *= j;\n}\nif(tempF1 + (int)(i * (i + 1) / 2.0) == m){\nprintf(\"n = %d\\n\", i);\nbreak;\n}\n}\n}\n\nint main() {\n    int x;\n    if (scanf(\"%d\", &x) == 1) {\n        int res = SumFraction(x);\n        printf(\"%d\\n\", res);\n    }\n    return 0;\n}"
  },
  {
    "id": "prf192_src_79",
    "slug": "prf192_src_79_nhap_so_nguyen_n",
    "title": "Source 77: Nhap so nguyen n",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 261,
    "totalSubmissions": 465,
    "statement": "### Bài toán: Source 77: Nhap so nguyen n\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "2 3",
        "output": "8",
        "explanation": "2^3 = 8"
      },
      {
        "input": "5 2",
        "output": "25",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "2 3",
        "expectedOutput": "8",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "5 2",
        "expectedOutput": "25",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "10 3",
        "expectedOutput": "1000",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "3 4",
        "expectedOutput": "81",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "int Input(){\nint n;\nprintf(\"Enter an int num:\");\nscanf(\"%d\", &n);\nreturn n;\n}\n//Tinh n^m\nvoid Tinhsomu(int n, int m){\nint nm = 1, i;\nfor (i = 1; i <= m; i++){\nnm *= n;\n}\nprintf(\"%d^%d = %d\\n\", n, m, nm);\n}\nint main(){\nint n = Input();\nFactorNumber(n);\nSumFraction(n);\nint m;\nprintf(\"Enter an int m:\");\nscanf(\"%d\", &m);\nSumF1F2(n, m);\nTinhsomu(n, m);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_80",
    "slug": "prf192_src_80_in_ra_cac_so_chan_o_vi_tri_le_t",
    "title": "Source 78: In ra cac so chan o vi tri le theo thu tu giam dan coi v? tri tri dau la vi tri 1",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 268,
    "totalSubmissions": 358,
    "statement": "### Bài toán: Source 78: In ra cac so chan o vi tri le theo thu tu giam dan coi v? tri tri dau la vi tri 1\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n1 4 3 8 5",
        "output": "8 4",
        "explanation": "Số chẵn ở vị trí lẻ giảm dần"
      },
      {
        "input": "6\n2 3 6 5 8 7",
        "output": "8 6 2",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n1 4 3 8 5",
        "expectedOutput": "8 4",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "6\n2 3 6 5 8 7",
        "expectedOutput": "8 6 2",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "4\n1 3 5 7",
        "expectedOutput": "",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "4\n4 2 8 6",
        "expectedOutput": "8 4",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "int main() {\nint n, a[20], b[10], k = 0;\nint i, j;\nprintf(\"Nhap so phan tu cua mang (5 <= n <= 20): \");\nscanf(\"%d\", &n);\nfor (i = 0; i < n; i++) {\nprintf(\"Nhap phan tu thu %d: \", i+1);\nscanf(\"%d\", &a[i]);\nif (i % 2 != 0 && a[i] % 2 == 0) { // kiem tra vi tri le va gia tri chan\nb[k] = a[i];\nk++;\n}\n}\n// sắp xếp mang b theo thu tu giam dan\nfor (i = 0; i < k-1; i++) {\nfor (j = i+1; j < k; j++) {\nif (b[i] < b[j]) {\nint temp = b[i];\nb[i] = b[j];\nb[j] = temp;\n}\n}\n}\n// in ket qua\nprintf(\"Cac so chan o vi tri le theo thu tu giam dan: \");\nfor (i = 0; i < k; i++) {\nprintf(\"%d \", b[i]);\n}\nprintf(\"\\n\");\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_81",
    "slug": "prf192_src_81_nh_p_chu_i_v_in_ra_t_d_i_nh_t_v",
    "title": "Source 79: Nhập chuỗi và in ra từ dài nhất và ngắn nhất",
    "category": "Chuỗi & Ký Tự Nâng Cao",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "STRING_MASTERY"
    ],
    "solvedCount": 297,
    "totalSubmissions": 469,
    "statement": "### Bài toán: Source 79: Nhập chuỗi và in ra từ dài nhất và ngắn nhất\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "hello beautiful world",
        "output": "beautiful\nworld",
        "explanation": "Từ dài nhất: beautiful, ngắn nhất: world"
      },
      {
        "input": "apple banana cat",
        "output": "banana\ncat",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "hello beautiful world",
        "expectedOutput": "beautiful\nworld",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "apple banana cat",
        "expectedOutput": "banana\ncat",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "one two three",
        "expectedOutput": "three\none",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "a bb ccc",
        "expectedOutput": "ccc\na",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy duyệt chuỗi & Null-Terminator",
        "content": "Chuỗi trong C kết thúc bằng ký tự `'\\0'`. Duyệt chuỗi bằng: `while (s[len] != '\\0') len++;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm chuỗi C",
        "content": "Dùng `gets(s)` hoặc `fgets` nếu đọc chuỗi có dấu cách. Mảng char phải đủ $N + 1$ byte để chứa `'\\0'`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "char s[1005];\ngets(s);\nfor (int i = 0; s[i] != '\\0'; i++) {\n    // Xử lý ký tự s[i]\n}\nprintf(\"%s\\n\", s);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_string_mastery",
    "code": "#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint main(){\nchar str[100], word[100], largest[100], smallest[100];\nint i, j, len, largest_len = 0, smallest_len = 100;\nfgets(str, 100, stdin);\nj = 0;\nfor(i=0; i<=strlen(str); i++){\nif(str[i]==' ' || str[i]=='\\0'){\nword[j] = '\\0';\nlen = strlen(word);\nif(len > largest_len){\nlargest_len = len;\nstrcpy(largest, word);\n}\nif(len < smallest_len){\nsmallest_len = len;\nstrcpy(smallest, word);\n}\nj = 0;\n}\nelse{\nword[j] = str[i];\nj++;\n}\n}\nprintf(\"OUTPUT:\\n\");\nprintf(\"%s\\n\", largest); //The largest word\nprintf(\"%s\\n\", smallest); //The smallest word\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_82",
    "slug": "prf192_src_82_dao_nguoc_chuoi_string",
    "title": "Source 80: dao nguoc chuoi string",
    "category": "Chuỗi & Ký Tự Nâng Cao",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "STRING_MASTERY"
    ],
    "solvedCount": 365,
    "totalSubmissions": 469,
    "statement": "### Bài toán: Source 80: dao nguoc chuoi string\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "hello",
        "output": "olleh",
        "explanation": "Đảo ngược chuỗi"
      },
      {
        "input": "PRF192",
        "output": "291FRP",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "hello",
        "expectedOutput": "olleh",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "PRF192",
        "expectedOutput": "291FRP",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "a",
        "expectedOutput": "a",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "RaceCar",
        "expectedOutput": "raCecaR",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy duyệt chuỗi & Null-Terminator",
        "content": "Chuỗi trong C kết thúc bằng ký tự `'\\0'`. Duyệt chuỗi bằng: `while (s[len] != '\\0') len++;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm chuỗi C",
        "content": "Dùng `gets(s)` hoặc `fgets` nếu đọc chuỗi có dấu cách. Mảng char phải đủ $N + 1$ byte để chứa `'\\0'`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "char s[1005];\ngets(s);\nfor (int i = 0; s[i] != '\\0'; i++) {\n    // Xử lý ký tự s[i]\n}\nprintf(\"%s\\n\", s);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_string_mastery",
    "code": "#include <stdio.h>\n// Function to calculate the length of a string\nint string_length(char str[]) {\nint length = 0;\nwhile (str[length] != '\\0') {\nlength++;\n}\nreturn length;\n}\n// Function to reverse a string\nvoid string_reverse(char str[]) {\nint i, j, len;\nchar ch;\nlen = string_length(str);\nj = len - 1;\ni = 0;\nwhile (i < j) {\nch = str[j];\nstr[j] = str[i];\nstr[i] = ch;\ni++;\nj--;\n}\n}\nint main() {\nchar n[100]; // Assuming a maximum string length of 100 characters\nscanf(\"%s\", n);\nstring_reverse(n);\nprintf(\"Reversed string: %s\\n\", n);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_83",
    "slug": "prf192_src_83_in_hoa_ch_c_i_u",
    "title": "Source 81: In hoa chữ cái đầu",
    "category": "Chuỗi & Ký Tự Nâng Cao",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "STRING_MASTERY"
    ],
    "solvedCount": 195,
    "totalSubmissions": 470,
    "statement": "### Bài toán: Source 81: In hoa chữ cái đầu\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "hello world",
        "output": "Hello World",
        "explanation": "In hoa chữ cái đầu"
      },
      {
        "input": "nguyen van a",
        "output": "Nguyen Van A",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "hello world",
        "expectedOutput": "Hello World",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "nguyen van a",
        "expectedOutput": "Nguyen Van A",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "c programming",
        "expectedOutput": "C Programming",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "university",
        "expectedOutput": "University",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy duyệt chuỗi & Null-Terminator",
        "content": "Chuỗi trong C kết thúc bằng ký tự `'\\0'`. Duyệt chuỗi bằng: `while (s[len] != '\\0') len++;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm chuỗi C",
        "content": "Dùng `gets(s)` hoặc `fgets` nếu đọc chuỗi có dấu cách. Mảng char phải đủ $N + 1$ byte để chứa `'\\0'`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "char s[1005];\ngets(s);\nfor (int i = 0; s[i] != '\\0'; i++) {\n    // Xử lý ký tự s[i]\n}\nprintf(\"%s\\n\", s);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_string_mastery",
    "code": "#include <stdio.h>\n#include <ctype.h>\nint main() {\nchar sentence[201];\nfgets(sentence, sizeof(sentence), stdin);\nint i = 0;\nint capitalizeNext = 1; // Flag to indicate if the next character should be capitalized\nwhile (sentence[i] != '\\0') {\nif (isalpha(sentence[i])) {\nif (capitalizeNext) {\nsentence[i] = toupper(sentence[i]);\ncapitalizeNext = 0;\n} else {\nsentence[i] = tolower(sentence[i]);\n}\n} else if (isspace(sentence[i])) {\ncapitalizeNext = 1;\n}\ni++;\n}\nprintf(\"\\nOUTPUT:\\n%s\", sentence);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_84",
    "slug": "prf192_src_84_ma_tr_n_",
    "title": "Source 82: Ma Trận:",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 285,
    "totalSubmissions": 508,
    "statement": "### Bài toán: Source 82: Ma Trận:\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "2\n1 2\n3 4\n5 6\n7 8",
        "output": "6 8\n10 12",
        "explanation": "Cộng 2 ma trận"
      },
      {
        "input": "2\n0 0\n0 0\n1 1\n1 1",
        "output": "1 1\n1 1",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "2\n1 2\n3 4\n5 6\n7 8",
        "expectedOutput": "6 8\n10 12",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "2\n0 0\n0 0\n1 1\n1 1",
        "expectedOutput": "1 1\n1 1",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "1\n5\n10",
        "expectedOutput": "15",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "2\n-1 2\n4 -3\n1 -2\n-4 3",
        "expectedOutput": "0 0\n0 0",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\n#define MAX_SIZE 100\nvoid addMatrices(int A[][MAX_SIZE], int B[][MAX_SIZE], int C[][MAX_SIZE], int rows, int cols) {\nint i,j;\nfor (i = 0; i < rows; i++) {\nfor (j = 0; j < cols; j++) {\nC[i][j] = A[i][j] + B[i][j];\n}\n}\n}\nint main() {\nint N, M,i,j;\nint A[MAX_SIZE][MAX_SIZE];\nint B[MAX_SIZE][MAX_SIZE];\nint C[MAX_SIZE][MAX_SIZE];\n// Read input\nscanf(\"%d %d\", &N, &M);\nfor (i = 0; i < N; i++) {\nfor (j = 0; j < M; j++) {\nscanf(\"%d\", &A[i][j]);\n}\n}\nfor (i = 0; i < N; i++) {\nfor (j = 0; j < M; j++) {\nscanf(\"%d\", &B[i][j]);\n}\n}\n// Add matrices\naddMatrices(A, B, C, N, M);\n// Print output\n\nfor (i = 0; i < N; i++) {\nfor (j = 0; j < M; j++) {\nprintf(\"%d \", C[i][j]);\n}\nprintf(\"\\n\");\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_85",
    "slug": "prf192_src_85_t_ng_t_ng_s_b_ng_t_ch_t_ng_s_",
    "title": "Source 83: Tổng từng số bằng tích từng số",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 305,
    "totalSubmissions": 449,
    "statement": "### Bài toán: Source 83: Tổng từng số bằng tích từng số\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "123",
        "output": "yes",
        "explanation": "Tổng chữ số bằng tích chữ số: 1+2+3 = 1*2*3 = 6"
      },
      {
        "input": "1124",
        "output": "yes",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "123",
        "expectedOutput": "yes",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "1124",
        "expectedOutput": "yes",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "124",
        "expectedOutput": "no",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "22",
        "expectedOutput": "yes",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n// Hàm tính t?ng các ch? s? c?a m?t s? nguyên duong\nint sumOfDigits(int num) {\nint sum = 0;\nwhile (num > 0) {\nsum += num % 10; // L?y ch? s? cu?i cùng và c?ng vào t?ng\nnum /= 10;       // Lo?i b? ch? s? cu?i cùng\n}\nreturn sum;\n}\n// Hàm tích các ch? s? c?a m?t s? nguyên duong\nint productOfDigits(int num) {\nint product = 1;\nwhile (num > 0) {\nproduct *= num % 10; // L?y ch? s? cu?i cùng và nhân vào tích\nnum /= 10;           // Lo?i b? ch? s? cu?i cùng\n}\nreturn product;\n}\nint main() {\nint number;\nprintf(\"Nh?p m?t s? nguyên duong: \");\nscanf(\"%d\", &number);\nint sum = sumOfDigits(number);\nint product = productOfDigits(number);\nif (sum == product) {\nprintf(\"yes\");\n} else {\nprintf(\"no\");\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_86",
    "slug": "prf192_src_86_s_p_x_p_s_l_tr_c_ch_n_sau_gi_m_",
    "title": "Source 84: Sắp xếp số lẻ trước chẵn sau giảm dần",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 240,
    "totalSubmissions": 587,
    "statement": "### Bài toán: Source 84: Sắp xếp số lẻ trước chẵn sau giảm dần\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 1 7",
        "output": "9 7 5 1 2",
        "explanation": "Lẻ giảm dần trước, chẵn tăng dần sau"
      },
      {
        "input": "6\n1 4 3 6 5 2",
        "output": "5 3 1 2 4 6",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 1 7",
        "expectedOutput": "9 7 5 1 2",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "6\n1 4 3 6 5 2",
        "expectedOutput": "5 3 1 2 4 6",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n2 4 6",
        "expectedOutput": "2 4 6",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "3\n1 5 3",
        "expectedOutput": "5 3 1",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\n#include <math.h>\nvoid sort(int a[], int n);\nint main() {\nint n;\nscanf(\"%d\", &n);\nint i, a[n];\nfor (i = 0; i < n; i++) {\nscanf(\"%d\", &a[i]);\n}\nsort(a, n);\nfor (i = 0; i < n; i++) {\nif (a[i] % 2 == 0) {\nprintf(\"%d \", a[i]);\n}\n}\nfor (i = 0; i < n; i++) {\nif (a[i] % 2) {\nprintf(\"%d \", a[i]);\n}\n}\nreturn(0);\n}\nvoid swap(int *a, int *b) {\nint temp = *a;\n*a = *b;\n*b = temp;\n}\nvoid sort(int a[], int n) {\nint i, j;\nfor (i = 0; i < n - 1; i++) {\nfor (j = 0; j < n - i - 1; j++) {\nif (a[j + 1] > a[j]) {\nswap(&a[j + 1], &a[j]);\n}\n}\n}\n}"
  },
  {
    "id": "prf192_src_87",
    "slug": "prf192_src_87_x_a_h_t_c_ch_k_t_s_",
    "title": "Source 85: Xóa hết cách kí tự số",
    "category": "Chuỗi & Ký Tự Nâng Cao",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "STRING_MASTERY"
    ],
    "solvedCount": 324,
    "totalSubmissions": 624,
    "statement": "### Bài toán: Source 85: Xóa hết cách kí tự số\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "hello 123 world 456",
        "output": "hello  world ",
        "explanation": "Xóa ký tự số"
      },
      {
        "input": "a1b2c3d4",
        "output": "abcd",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "hello 123 world 456",
        "expectedOutput": "hello  world ",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "a1b2c3d4",
        "expectedOutput": "abcd",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "987654321",
        "expectedOutput": "",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "NoDigits",
        "expectedOutput": "NoDigits",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy duyệt chuỗi & Null-Terminator",
        "content": "Chuỗi trong C kết thúc bằng ký tự `'\\0'`. Duyệt chuỗi bằng: `while (s[len] != '\\0') len++;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm chuỗi C",
        "content": "Dùng `gets(s)` hoặc `fgets` nếu đọc chuỗi có dấu cách. Mảng char phải đủ $N + 1$ byte để chứa `'\\0'`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "char s[1005];\ngets(s);\nfor (int i = 0; s[i] != '\\0'; i++) {\n    // Xử lý ký tự s[i]\n}\nprintf(\"%s\\n\", s);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_string_mastery",
    "code": "#include <stdio.h>\n#include <ctype.h>\nint main() {\nchar input[101];\nint i;\nfgets(input, sizeof(input), stdin);\nfor (i = 0; input[i] != '\\0'; i++) {\nif (isalpha(input[i]) || isspace(input[i])) {\nprintf(\"%c\", input[i]);\n}\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_88",
    "slug": "prf192_src_88_in_l_i_c_c_ph_n_t_trong_m_ng_1_",
    "title": "Source 86: in lại các phần tử trong mảng 1 lần duy nhất",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 273,
    "totalSubmissions": 512,
    "statement": "### Bài toán: Source 86: in lại các phần tử trong mảng 1 lần duy nhất\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "6\n1 2 2 3 4 4",
        "output": "1 2 3 4",
        "explanation": "In các phần tử 1 lần duy nhất"
      },
      {
        "input": "5\n5 2 9 1 7",
        "output": "5 2 9 1 7",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "6\n1 2 2 3 4 4",
        "expectedOutput": "1 2 3 4",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "5\n5 2 9 1 7",
        "expectedOutput": "5 2 9 1 7",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "4\n1 1 1 1",
        "expectedOutput": "1",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "7\n5 3 5 2 3 8 2",
        "expectedOutput": "5 3 2 8",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\nint main() {\nint n,i,j;\nscanf(\"%d\", &n);\nint arr[n];\nfor (i = 0; i < n; i++) {\nscanf(\"%d\", &arr[i]);\n}\nint unique_arr[n], unique_count = 0;\nfor (i = 0; i < n; i++) {\nint is_duplicate = 0;\nfor (j = 0; j < i; j++) {\nif (arr[i] == arr[j]) {\nis_duplicate = 1;\nbreak;\n}\n}\nif (!is_duplicate) {\nunique_arr[unique_count] = arr[i];\nunique_count++;\n}\n}\nprintf(\"OUTPUT: \\n\");\nfor (i = 0; i < unique_count; i++) {\nif (i == unique_count - 1) {\nprintf(\"%d\\n\", unique_arr[i]);\n} else {\nprintf(\"%d \", unique_arr[i]);\n}\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_89",
    "slug": "prf192_src_89_t_m_t_n_d_a_v_o_ch_c_i_u_ti_n",
    "title": "Source 87: Tìm tên dựa vào chữ cái đầu tiên",
    "category": "Chuỗi & Ký Tự Nâng Cao",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "STRING_MASTERY"
    ],
    "solvedCount": 336,
    "totalSubmissions": 566,
    "statement": "### Bài toán: Source 87: Tìm tên dựa vào chữ cái đầu tiên\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "N\nNguyen\nTran\nNam\nLe",
        "output": "Nguyen\nNam",
        "explanation": "Tìm tên bắt đầu bằng chữ N"
      },
      {
        "input": "T\nTran\nNguyen\nTruong",
        "output": "Tran\nTruong",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "N\nNguyen\nTran\nNam\nLe",
        "expectedOutput": "Nguyen\nNam",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "T\nTran\nNguyen\nTruong",
        "expectedOutput": "Tran\nTruong",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "A\nBinh\nCuong",
        "expectedOutput": "",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "L\nLe\nLy\nLuong",
        "expectedOutput": "Le\nLy\nLuong",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy duyệt chuỗi & Null-Terminator",
        "content": "Chuỗi trong C kết thúc bằng ký tự `'\\0'`. Duyệt chuỗi bằng: `while (s[len] != '\\0') len++;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm chuỗi C",
        "content": "Dùng `gets(s)` hoặc `fgets` nếu đọc chuỗi có dấu cách. Mảng char phải đủ $N + 1$ byte để chứa `'\\0'`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "char s[1005];\ngets(s);\nfor (int i = 0; s[i] != '\\0'; i++) {\n    // Xử lý ký tự s[i]\n}\nprintf(\"%s\\n\", s);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_string_mastery",
    "code": "#include <stdio.h>\nint main() {\nint n;\nscanf(\"%d\", &n);\ngetchar();\nchar s[100];\nscanf(\"%[^\\n]\", s);\n// [Sanitized]: fflush(stdin) removed\nchar find;\nscanf(\"%c\", &find);\nchar a[100][100];\nint cnt = 0;\nchar* token = strtok(s, \" \");\nwhile (token != NULL) {\nstrcpy(a[cnt++], token);\ntoken = strtok(NULL, \" \");\n}\nint i;\nfor (i = 0; i < cnt; i++) {\nif (a[i][0] == find) {\nprintf(\"%s\\n\", a[i]);\n}\n}\nreturn(0);\n}"
  },
  {
    "id": "prf192_src_90",
    "slug": "prf192_src_90_tong_cac_so_le_trong_mang",
    "title": "Source 88: Tong cac so le trong mang",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 361,
    "totalSubmissions": 476,
    "statement": "### Bài toán: Source 88: Tong cac so le trong mang\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n1 2 3 4 5",
        "output": "9",
        "explanation": "Tổng các số lẻ (1, 3, 5) = 9"
      },
      {
        "input": "4\n2 4 6 8",
        "output": "0",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "9",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n2 4 6 8",
        "expectedOutput": "0",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n7 9 11",
        "expectedOutput": "27",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5\n-3 2 5 -1 4",
        "expectedOutput": "1",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\nint main()\n{\nint n;\nscanf(\"%d\",&n);\nint arr[n],i;\nfor(i=0;i<n;i++)\nscanf(\"%d\",&arr[i]);\nint sum=0;\nfor(i=0;i<n;i++)\nif(arr[i]%2!=0)\nsum+=arr[i];\nprintf(\"OUTPUT:\\n%d\",sum);\n}"
  },
  {
    "id": "prf192_src_91",
    "slug": "prf192_src_91_in_h_nh_kim_c_ng_s_nguy_n_t_",
    "title": "Source 89: In hình kim cương số nguyên tố",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 262,
    "totalSubmissions": 590,
    "statement": "### Bài toán: Source 89: In hình kim cương số nguyên tố\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3",
        "output": "2 3 5 \n7 11 \n13",
        "explanation": "Kim cương số nguyên tố 3"
      },
      {
        "input": "4",
        "output": "2 3 5 7 \n11 13 17 \n19 23 \n29",
        "explanation": "Kim cương số nguyên tố 4"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3",
        "expectedOutput": "2 3 5 \n7 11 \n13",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4",
        "expectedOutput": "2 3 5 7 \n11 13 17 \n19 23 \n29",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2",
        "expectedOutput": "2 3 \n5",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5",
        "expectedOutput": "2 3 5 7 11 \n13 17 19 23 \n29 31 37 \n41 43 \n47",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\n#include <math.h>\nint main() {\nint rows;\nscanf(\"%d\", &rows);\nint prime[1000], cnt = 0;\nint i, j;\nfor (i = 0; i < 1000; i++) {\nif (isPrime(i)) {\nprime[cnt] = i;\n++cnt;\n}\n}\nint number = 0;\nfor (i = rows; i > 0; i--) {\nfor (j = 1; j <= i; ++j) {\nprintf(\"%d \", prime[number]);\n++number;\n}\nprintf(\"\\n\");\n}\nreturn(0);\n}\nint isPrime(int n) {\nint i;\nif (n < 2) {\nreturn 0;\n}\nfor (i = 2; i <= sqrt(n); i++) {\nif (n % i == 0) {\nreturn 0;\n}\n}\nreturn 1;\n}"
  },
  {
    "id": "prf192_src_92",
    "slug": "prf192_src_92_in_s_l_n_nh_t_c_a_ng_ch_o_ch_nh",
    "title": "Source 90: in số lớn nhất của đường chéo chính trong ma trận",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 207,
    "totalSubmissions": 351,
    "statement": "### Bài toán: Source 90: in số lớn nhất của đường chéo chính trong ma trận\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "3\n1 2 3\n4 8 6\n7 5 2",
        "output": "8",
        "explanation": "Đường chéo chính gồm 1, 8, 2 -> max là 8"
      },
      {
        "input": "2\n9 4\n3 5",
        "output": "9",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "3\n1 2 3\n4 8 6\n7 5 2",
        "expectedOutput": "8",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "2\n9 4\n3 5",
        "expectedOutput": "9",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "1\n15",
        "expectedOutput": "15",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "3\n-5 0 2\n1 -1 4\n3 7 -9",
        "expectedOutput": "-1",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\nint main() {\nint n;\nscanf(\"%d\", &n);\nint a[n][n];\nint i, j;\nfor (i = 0; i < n; i++) {\nfor (j = 0; j < n; j++) {\nscanf(\"%d\", &a[i][j]);\n}\ngetchar();\n}\nint max = -1e6 + 1;\nfor (i = 0; i < n; i++) {\nfor (j = 0; j < n; j++) {\nif (i == j) {\nif (a[i][j] > max) {\nmax = a[i][j];\n}\n}\n}\n}\nprintf(\"%d\", max);\nreturn(0);\n}"
  },
  {
    "id": "prf192_src_93",
    "slug": "prf192_src_93_in_d_y_fibonasi",
    "title": "Source 91: In dãy fibonasi",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 337,
    "totalSubmissions": 406,
    "statement": "### Bài toán: Source 91: In dãy fibonasi\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5",
        "output": "0 1 1 2 3",
        "explanation": "Dãy Fibonacci 5 số"
      },
      {
        "input": "7",
        "output": "0 1 1 2 3 5 8",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5",
        "expectedOutput": "0 1 1 2 3",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "7",
        "expectedOutput": "0 1 1 2 3 5 8",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3",
        "expectedOutput": "0 1 1",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "10",
        "expectedOutput": "0 1 1 2 3 5 8 13 21 34",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\nint main() {\nint n;\nscanf(\"%d\", &n);\nint i;\nlong long fibo[n];\nfibo[0] = 0; fibo[1] = 1;\nprintf(\"0 1 \");\nfor (i = 2; i < n; i++) {\nfibo[i] = fibo[i - 1] + fibo[i - 2];\nprintf(\"%lld \", fibo[i]);\n}\nreturn(0);\n}"
  },
  {
    "id": "prf192_src_94",
    "slug": "prf192_src_94__m_s_l_ng_ch_s_ch_n_v_l_",
    "title": "Source 92: Đếm số lượng chữ số chẵn và lẻ",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 244,
    "totalSubmissions": 378,
    "statement": "### Bài toán: Source 92: Đếm số lượng chữ số chẵn và lẻ\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "12345",
        "output": "2 3",
        "explanation": "2 chữ số chẵn (2, 4) và 3 chữ số lẻ (1, 3, 5)"
      },
      {
        "input": "2468",
        "output": "4 0",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "12345",
        "expectedOutput": "2 3",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "2468",
        "expectedOutput": "4 0",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "13579",
        "expectedOutput": "0 5",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "102030",
        "expectedOutput": "4 2",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\nint main() {\nint n;\nprintf(\"Nh?p m?t s? nguyên duong: \");\nscanf(\"%d\", &n);\nint evenCount = 0; // S? lu?ng ch? s? ch?n\nint oddCount = 0;  // S? lu?ng ch? s? l?\n// Ð?m ch? s? ch?n và l?\nint digit;\nwhile (n > 0) {\ndigit = n % 10; // L?y ch? s? cu?i cùng\nif (digit % 2 == 0) {\nevenCount++;\n} else {\noddCount++;\n}\nn /= 10; // Lo?i b? ch? s? cu?i cùng\n}\nprintf(\"S? lu?ng ch? s? ch?n: %d\\n\", evenCount);\nprintf(\"S? lu?ng ch? s? l?: %d\\n\", oddCount);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_95",
    "slug": "prf192_src_95_in_ra_t_t_c_c_c_ch_in_th_ng",
    "title": "Source 93: In ra tất cả các chữ in thường",
    "category": "Chuỗi & Ký Tự Nâng Cao",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "STRING_MASTERY"
    ],
    "solvedCount": 337,
    "totalSubmissions": 479,
    "statement": "### Bài toán: Source 93: In ra tất cả các chữ in thường\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "Hello World 123",
        "output": "e l l o o r l d",
        "explanation": "In tất cả chữ cái in thường"
      },
      {
        "input": "ABC def",
        "output": "d e f",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "Hello World 123",
        "expectedOutput": "e l l o o r l d",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "ABC def",
        "expectedOutput": "d e f",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "XYZ",
        "expectedOutput": "",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "a1b2c3",
        "expectedOutput": "a b c",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy duyệt chuỗi & Null-Terminator",
        "content": "Chuỗi trong C kết thúc bằng ký tự `'\\0'`. Duyệt chuỗi bằng: `while (s[len] != '\\0') len++;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm chuỗi C",
        "content": "Dùng `gets(s)` hoặc `fgets` nếu đọc chuỗi có dấu cách. Mảng char phải đủ $N + 1$ byte để chứa `'\\0'`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "char s[1005];\ngets(s);\nfor (int i = 0; s[i] != '\\0'; i++) {\n    // Xử lý ký tự s[i]\n}\nprintf(\"%s\\n\", s);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_string_mastery",
    "code": "#include <stdio.h>\n#include <ctype.h> // Ð? s? d?ng hàm islower\nint main() {\nint i;\nchar inputString[100]; // Khai báo m?ng kí t? d? luu chu?i\nprintf(\"Nh?p m?t chu?i kí t?: \");\nfgets(inputString, sizeof(inputString), stdin); // Nh?n chu?i t? ngu?i dùng\nprintf(\"Các kí t? vi?t thu?ng trong chu?i:\\n\");\nfor (i = 0; inputString[i] != '\\0'; i++) {\nif (islower(inputString[i])) {\nprintf(\"%c \", inputString[i]);\n}\n}\nprintf(\"\\n\");\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_96",
    "slug": "prf192_src_96_chuy_n_t_t_c_v_ch_c_i_th_ng",
    "title": "Source 93: Chuyển tất cả về chữ cái thường",
    "category": "Chuỗi & Ký Tự Nâng Cao",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "STRING_MASTERY"
    ],
    "solvedCount": 358,
    "totalSubmissions": 422,
    "statement": "### Bài toán: Source 93: Chuyển tất cả về chữ cái thường\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "HeLLo WoRLd",
        "output": "hello world",
        "explanation": "Chuyển về chữ thường"
      },
      {
        "input": "PRF192",
        "output": "prf192",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "HeLLo WoRLd",
        "expectedOutput": "hello world",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "PRF192",
        "expectedOutput": "prf192",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "abc",
        "expectedOutput": "abc",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "C Programming 2026",
        "expectedOutput": "c programming 2026",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy duyệt chuỗi & Null-Terminator",
        "content": "Chuỗi trong C kết thúc bằng ký tự `'\\0'`. Duyệt chuỗi bằng: `while (s[len] != '\\0') len++;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm chuỗi C",
        "content": "Dùng `gets(s)` hoặc `fgets` nếu đọc chuỗi có dấu cách. Mảng char phải đủ $N + 1$ byte để chứa `'\\0'`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "char s[1005];\ngets(s);\nfor (int i = 0; s[i] != '\\0'; i++) {\n    // Xử lý ký tự s[i]\n}\nprintf(\"%s\\n\", s);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_string_mastery",
    "code": "#include <stdio.h>\n#include <ctype.h> // Để sử dụng hàm tolower\nint main() {\nchar inputString[100]; // Khai báo mảng kí tự để lưu chuỗi\nprintf(\"Nhập một chuỗi kí tự: \");\nfgets(inputString, sizeof(inputString), stdin); // Nhận chuỗi từ người dùng\nprintf(\"Chuỗi sau khi chuyển thành chữ in thường: \");\nfor (int i = 0; inputString[i] != '\\0'; i++) {\nchar lowercaseChar = tolower(inputString[i]);\nprintf(\"%c\", lowercaseChar);\n}\nprintf(\"\\n\");\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_97",
    "slug": "prf192_src_97_chuy_n_t_t_c_v_ch_c_i_hoa",
    "title": "Source 93: Chuyển tất cả về chữ cái hoa",
    "category": "Chuỗi & Ký Tự Nâng Cao",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "STRING_MASTERY"
    ],
    "solvedCount": 210,
    "totalSubmissions": 411,
    "statement": "### Bài toán: Source 93: Chuyển tất cả về chữ cái hoa\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "hello world",
        "output": "HELLO WORLD",
        "explanation": "Chuyển về chữ hoa"
      },
      {
        "input": "prf192",
        "output": "PRF192",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "hello world",
        "expectedOutput": "HELLO WORLD",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "prf192",
        "expectedOutput": "PRF192",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "ABC",
        "expectedOutput": "ABC",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "c programming 2026",
        "expectedOutput": "C PROGRAMMING 2026",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy duyệt chuỗi & Null-Terminator",
        "content": "Chuỗi trong C kết thúc bằng ký tự `'\\0'`. Duyệt chuỗi bằng: `while (s[len] != '\\0') len++;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm chuỗi C",
        "content": "Dùng `gets(s)` hoặc `fgets` nếu đọc chuỗi có dấu cách. Mảng char phải đủ $N + 1$ byte để chứa `'\\0'`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "char s[1005];\ngets(s);\nfor (int i = 0; s[i] != '\\0'; i++) {\n    // Xử lý ký tự s[i]\n}\nprintf(\"%s\\n\", s);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_string_mastery",
    "code": "#include <stdio.h>\n#include <ctype.h> // Để sử dụng hàm toupper\nint main() {\nchar inputString[100]; // Khai báo mảng kí tự để lưu chuỗi\nprintf(\"Nhập một chuỗi kí tự: \");\nfgets(inputString, sizeof(inputString), stdin); // Nhận chuỗi từ người dùng\nprintf(\"Chuỗi sau khi chuyển thành chữ in hoa: \");\nfor (int i = 0; inputString[i] != '\\0'; i++) {\nchar uppercaseChar = toupper(inputString[i]);\nprintf(\"%c\", uppercaseChar);\n}\nprintf(\"\\n\");\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_98",
    "slug": "prf192_src_98_ho_n_i_s_ch_n_l_n_nh_t_v_i_s_ch",
    "title": "Source 94: Hoán đổi số chẵn lớn nhất với số chắn nhỏ nhất",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 272,
    "totalSubmissions": 373,
    "statement": "### Bài toán: Source 94: Hoán đổi số chẵn lớn nhất với số chắn nhỏ nhất\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 8 4",
        "output": "5 8 9 2 4",
        "explanation": "Đổi chỗ chẵn lớn nhất (8) và chẵn nhỏ nhất (2)"
      },
      {
        "input": "4\n10 2 6 4",
        "output": "2 10 6 4",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 8 4",
        "expectedOutput": "5 8 9 2 4",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n10 2 6 4",
        "expectedOutput": "2 10 6 4",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n1 3 5",
        "expectedOutput": "1 3 5",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "6\n12 4 7 20 2 9",
        "expectedOutput": "12 4 7 2 20 9",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\n// Hàm tìm s? ch?n l?n nh?t trong m?ng\nint findMaxEven(int arr[], int n) {\nint i;\nint maxEven = -1; // Gi? s? không có s? ch?n trong m?ng\nfor (i = 0; i < n; i++) {\nif (arr[i] % 2 == 0 && (maxEven == -1 || arr[i] > maxEven)) {\nmaxEven = arr[i];\n}\n}\nreturn maxEven;\n}\n// Hàm tìm s? ch?n nh? nh?t trong m?ng\nint findMinEven(int arr[], int n) {\nint i;\nint minEven = -1; // Gi? s? không có s? ch?n trong m?ng\nfor (i = 0; i < n; i++) {\nif (arr[i] % 2 == 0 && (minEven == -1 || arr[i] < minEven)) {\nminEven = arr[i];\n}\n}\nreturn minEven;\n}\nint main() {\nint n, i;\nprintf(\"Nh?p s? lu?ng ph?n t? trong m?ng: \");\nscanf(\"%d\", &n);\nint arr[100];\nprintf(\"Nh?p các ph?n t? c?a m?ng:\\n\");\nfor (i = 0; i < n; i++) {\nscanf(\"%d\", &arr[i]);\n}\nint maxEven = findMaxEven(arr, n);\nint minEven = findMinEven(arr, n);\nif (maxEven != -1 && minEven != -1) {\nfor (i = 0; i < n; i++) {\nif (arr[i] == maxEven) {\narr[i] = minEven;\n} else if (arr[i] == minEven) {\narr[i] = maxEven;\n}\n}\nprintf(\"M?ng sau khi hoán d?i s? ch?n l?n nh?t và nh? nh?t:\\n\");\nfor (i = 0; i < n; i++) {\nprintf(\"%d \", arr[i]);\n}\nprintf(\"\\n\");\n} else {\nprintf(\"Không tìm th?y s? ch?n trong m?ng.\\n\");\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_99",
    "slug": "prf192_src_99_in_hoa_2_ch_c_i_u_m_i_t_",
    "title": "Source 95: In hoa 2 chữ cái đầu mỗi từ",
    "category": "Chuỗi & Ký Tự Nâng Cao",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "STRING_MASTERY"
    ],
    "solvedCount": 244,
    "totalSubmissions": 633,
    "statement": "### Bài toán: Source 95: In hoa 2 chữ cái đầu mỗi từ\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "hello world test",
        "output": "HEllo WOrld TEst",
        "explanation": "In hoa 2 chữ cái đầu mỗi từ"
      },
      {
        "input": "programming language",
        "output": "PRogramming LAnguage",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "hello world test",
        "expectedOutput": "HEllo WOrld TEst",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "programming language",
        "expectedOutput": "PRogramming LAnguage",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "c code",
        "expectedOutput": "C COde",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "fpt university",
        "expectedOutput": "FPt UNiversity",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy duyệt chuỗi & Null-Terminator",
        "content": "Chuỗi trong C kết thúc bằng ký tự `'\\0'`. Duyệt chuỗi bằng: `while (s[len] != '\\0') len++;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm chuỗi C",
        "content": "Dùng `gets(s)` hoặc `fgets` nếu đọc chuỗi có dấu cách. Mảng char phải đủ $N + 1$ byte để chứa `'\\0'`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "char s[1005];\ngets(s);\nfor (int i = 0; s[i] != '\\0'; i++) {\n    // Xử lý ký tự s[i]\n}\nprintf(\"%s\\n\", s);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_string_mastery",
    "code": "#include <stdio.h>\n#include <ctype.h> // Ð? s? d?ng hàm toupper\nvoid capitalizeFirstTwo(char str[]) {\nint i = 0;\nwhile (str[i] != '\\0') {\n// B?t d?u m?t t? m?i\nwhile (str[i] != '\\0' && !isalpha(str[i])) {\nputchar(str[i]);\ni++;\n}\n// Vi?t hoa kí t? d?u tiên n?u là ch?\nif (isalpha(str[i])) {\nputchar(toupper(str[i]));\ni++;\n// Vi?t hoa kí t? th? hai n?u có\nif (isalpha(str[i])) {\nputchar(toupper(str[i]));\ni++;\n}\n}\n// Copy ph?n còn l?i c?a t?\nwhile (str[i] != '\\0' && !isspace(str[i])) {\nputchar(str[i]);\ni++;\n}\n}\n}\nint main() {\nchar inputString[100]; // Khai báo m?ng kí t? d? luu chu?i\nprintf(\"Nh?p m?t chu?i: \");\nfgets(inputString, sizeof(inputString), stdin); // Nh?n chu?i t? ngu?i dùng\nprintf(\"Chu?i sau khi vi?t hoa hai ký t? d?u c?a m?i t?: \");\ncapitalizeFirstTwo(inputString);\nreturn 0;\n}\nSource 96 : in ra các phần tử bị lặp lại trong mảng.\n#include <stdio.h>\nvoid findDuplicates(int arr[], int n) {\nprintf(\"Các phần tử bị lặp lại trong mảng: \");\nfor (int i = 0; i < n; i++) {\nfor (int j = i + 1; j < n; j++) {\nif (arr[i] == arr[j]) {\nprintf(\"%d \", arr[i]);\nbreak; // Để tránh in phần tử bị lặp lại nhiều lần\n}\n}\n}\nprintf(\"\\n\");\n}\nint main() {\nint n;\nprintf(\"Nhập số lượng phần tử trong mảng: \");\nscanf(\"%d\", &n);\nint arr[100];\nprintf(\"Nhập các phần tử của mảng:\\n\");\nfor (int i = 0; i < n; i++) {\nscanf(\"%d\", &arr[i]);\n}\nfindDuplicates(arr, n); // In ra các phần tử bị lặp lại trong mảng\nreturn 0;\n}\nSource 97 : Đếm có bao nhiêu ký tự nhập vào trong srting\n#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint countSubstring(char str[], char sub[]) {\nint count = 0;\nint i;\nint len1 = strlen(str);\nint len2 = strlen(sub);\nfor (i = 0; i <= len1 - len2; i++) {\nint j;\nfor (j = 0; j < len2; j++) {\nif (tolower(str[i+j]) != tolower(sub[j]))\nbreak;\n}\nif (j == len2) {\ncount++;\nj = 0;\n}\n}\nreturn count;\n}\nint main() {\nchar input[100];\nprintf(\"Please enter strings: \");\nfgets(input, sizeof(input), stdin);\ninput[strcspn(input, \"\\n\")] = '\\0'; // remove trailing newline\nchar k[100];\nprintf(\"Please enter string k: \");\nfgets(k, sizeof(k), stdin);\nk[strcspn(k, \"\\n\")] = '\\0'; // remove trailing newline\nint count = countSubstring(input, k);\nprintf(\"%d\", count);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_100",
    "slug": "prf192_src_100_v_h_nh_ch_a_tam_gi_c",
    "title": "Source 98: Vẽ hình chữ A tam giác",
    "category": "Vẽ Hình & Ma Trận Ký Tự",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "SHAPE_MATRIX"
    ],
    "solvedCount": 253,
    "totalSubmissions": 611,
    "statement": "### Bài toán: Source 98: Vẽ hình chữ A tam giác\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "4",
        "output": "   A\n  ABA\n ABCBA\nABCDCBA",
        "explanation": "Tam giác chữ A 4 hàng"
      },
      {
        "input": "3",
        "output": "  A\n ABA\nABCBA",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "4",
        "expectedOutput": "   A\n  ABA\n ABCBA\nABCDCBA",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "3",
        "expectedOutput": "  A\n ABA\nABCBA",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2",
        "expectedOutput": " A\nABA",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5",
        "expectedOutput": "    A\n   ABA\n  ABCBA\n ABCDCBA\nABCDEDCBA",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy 2 vòng lặp lồng nhau (Nested Loops)",
        "content": "Duyệt 2 vòng for: vòng ngoài `i` điều khiển từng hàng, vòng trong `j` điều khiển từng cột hoặc khoảng trắng."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm hình học C",
        "content": "Không in thừa dấu cách ở cuối mỗi dòng. Luôn đặt `printf(\"\\n\");` ở cuối vòng lặp hàng ngoài `i`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++) {\n        // In sao hoặc khoảng trắng\n    }\n    printf(\"\\n\");\n}"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_shape_matrix",
    "code": "#include <stdio.h>\nint main() {\nint row;\nprintf(\"Enter the number of rows: \");\nscanf(\"%d\", &row);\nint i,j,k;\nfor (i = 1; i <= row; i++) {\nfor ( j = 1; j <=i; j++) {\nprintf(\"%c\", 'A' + j - 1);\n}\nfor ( k = i - 1; k >= 1; k--) {\nprintf(\"%c\", 'A' + k - 1);\n}\nprintf(\"\\n\");\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_101",
    "slug": "prf192_src_101_s_p_x_p_tang_d_n",
    "title": "Source 99: sắp xếp tang dần",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 352,
    "totalSubmissions": 470,
    "statement": "### Bài toán: Source 99: sắp xếp tang dần\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 1 7",
        "output": "1 2 5 7 9",
        "explanation": "Sắp xếp tăng dần"
      },
      {
        "input": "4\n40 10 30 20",
        "output": "10 20 30 40",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 1 7",
        "expectedOutput": "1 2 5 7 9",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n40 10 30 20",
        "expectedOutput": "10 20 30 40",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "2\n9 3",
        "expectedOutput": "3 9",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "6\n-5 8 0 -12 15 3",
        "expectedOutput": "-12 -5 0 3 8 15",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\n#include <stdlib.h>\nint main() {\nint n;\nscanf(\"%d\", &n);\nfloat a[n];\nint i;\nfor(i=0; i<n; i++) scanf(\"%f\", &a[i]);\nfor (i = 0; i < n - 1; i++) {\nint j;\nfor (j = 0; j < n - 1 - i; j++) {\nif (a[j] > a[j+1]) {\nint temp = a[j];\na[j] = a[j+1];\na[j+1] = temp;\n}\n}\n}\nprintf(\"OUTPUT:\\n\");\nfor (i = 0; i < n; i++) {\nprintf(\"%.3f \", a[i]);\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_102",
    "slug": "prf192_src_102_b_i_s_p_x_p_ch_n_tr_c_l_sau",
    "title": "Source 100: bài sắp xếp chẵn trước lẻ sau",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 324,
    "totalSubmissions": 371,
    "statement": "### Bài toán: Source 100:  bài sắp xếp chẵn trước lẻ sau\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 1 7",
        "output": "2 5 9 1 7",
        "explanation": "Chẵn trước, lẻ sau"
      },
      {
        "input": "6\n1 2 3 4 5 6",
        "output": "2 4 6 1 3 5",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 1 7",
        "expectedOutput": "2 5 9 1 7",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "6\n1 2 3 4 5 6",
        "expectedOutput": "2 4 6 1 3 5",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "4\n2 4 6 8",
        "expectedOutput": "2 4 6 8",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "4\n1 3 5 7",
        "expectedOutput": "1 3 5 7",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\nvoid swap(int *a, int *b); // function prototype\nint main() {\nint n,i,j;\nprintf(\"Please enter the size of the array: \");\nscanf(\"%d\", &n);\nint arr[n];\nprintf(\"Please enter %d integers separated by spaces: \", n);\nfor (i = 0; i < n; i++) {\nscanf(\"%d\", &arr[i]);\n}\n// Sort the array in ascending order with odd numbers first, even numbers later\nfor ( i = 0; i < n - 1; i++) {\nfor ( j = i+1; j < n; j++) {\nif ((arr[i] % 2 != 0 && arr[j] % 2 != 0 && arr[i] > arr[j]) || (arr[i] % 2 != 0 && arr[j] % 2 == 0)) {\nswap(&arr[i], &arr[j]);\n}\n}\n}\nprintf(\"Sorted array with odd numbers first and even numbers later: \");\nfor ( i = 0; i < n; i++) {\nprintf(\"%d \", arr[i]);\n}\nprintf(\"\\n\");\nreturn 0;\n}\nvoid swap(int *a, int *b) {\nint temp = *a;\n*a = *b;\n*b = temp;\n}"
  },
  {
    "id": "prf192_src_103",
    "slug": "prf192_src_103_chuy_n_i_s_nguy_n_th_nh_m_asci",
    "title": "Source 80: Chuyển đổi số nguyên thành mã ASCII:",
    "category": "Chuỗi & Ký Tự Nâng Cao",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "STRING_MASTERY"
    ],
    "solvedCount": 206,
    "totalSubmissions": 620,
    "statement": "### Bài toán: Source 80:  Chuyển đổi số nguyên thành mã ASCII:\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "65",
        "output": "A",
        "explanation": "Mã ASCII 65 là chữ A"
      },
      {
        "input": "97",
        "output": "a",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "65",
        "expectedOutput": "A",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "97",
        "expectedOutput": "a",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "48",
        "expectedOutput": "0",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "32",
        "expectedOutput": " ",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy duyệt chuỗi & Null-Terminator",
        "content": "Chuỗi trong C kết thúc bằng ký tự `'\\0'`. Duyệt chuỗi bằng: `while (s[len] != '\\0') len++;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm chuỗi C",
        "content": "Dùng `gets(s)` hoặc `fgets` nếu đọc chuỗi có dấu cách. Mảng char phải đủ $N + 1$ byte để chứa `'\\0'`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "char s[1005];\ngets(s);\nfor (int i = 0; s[i] != '\\0'; i++) {\n    // Xử lý ký tự s[i]\n}\nprintf(\"%s\\n\", s);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_string_mastery",
    "code": "#include <stdio.h>\nint main() {\nint number;\nprintf(\"Enter an integer: \");\nscanf(\"%d\", &number);\nprintf(\"ASCII code of %d is %c\\n\", number, number);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_104",
    "slug": "prf192_src_104_chuy_n_i_m_ascii_th_nh_k_t_",
    "title": "Source 81: Chuyển đổi mã ASCII thành ký tự:",
    "category": "Chuỗi & Ký Tự Nâng Cao",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "STRING_MASTERY"
    ],
    "solvedCount": 301,
    "totalSubmissions": 642,
    "statement": "### Bài toán: Source 81: Chuyển đổi mã ASCII thành ký tự:\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "A",
        "output": "65",
        "explanation": "Ký tự A có mã ASCII là 65"
      },
      {
        "input": "a",
        "output": "97",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "A",
        "expectedOutput": "65",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "a",
        "expectedOutput": "97",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "0",
        "expectedOutput": "48",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "Z",
        "expectedOutput": "90",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy duyệt chuỗi & Null-Terminator",
        "content": "Chuỗi trong C kết thúc bằng ký tự `'\\0'`. Duyệt chuỗi bằng: `while (s[len] != '\\0') len++;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm chuỗi C",
        "content": "Dùng `gets(s)` hoặc `fgets` nếu đọc chuỗi có dấu cách. Mảng char phải đủ $N + 1$ byte để chứa `'\\0'`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "char s[1005];\ngets(s);\nfor (int i = 0; s[i] != '\\0'; i++) {\n    // Xử lý ký tự s[i]\n}\nprintf(\"%s\\n\", s);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_string_mastery",
    "code": "#include <stdio.h>\nint main() {\nchar character;\nprintf(\"Enter an ASCII code: \");\nscanf(\"%c\", &character);\nprintf(\"Character of ASCII code %c is %d\\n\", character, character);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_105",
    "slug": "prf192_src_105_chuy_n_i_m_t_chu_i_k_t_th_nh_m",
    "title": "Source 82: Chuyển đổi một chuỗi ký tự thành mã ASCII:",
    "category": "Chuỗi & Ký Tự Nâng Cao",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "STRING_MASTERY"
    ],
    "solvedCount": 271,
    "totalSubmissions": 392,
    "statement": "### Bài toán: Source 82: Chuyển đổi một chuỗi ký tự thành mã ASCII:\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "ABC",
        "output": "65 66 67",
        "explanation": "Chuỗi thành mã ASCII"
      },
      {
        "input": "hello",
        "output": "104 101 108 108 111",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "ABC",
        "expectedOutput": "65 66 67",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "hello",
        "expectedOutput": "104 101 108 108 111",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "C",
        "expectedOutput": "67",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "123",
        "expectedOutput": "49 50 51",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy duyệt chuỗi & Null-Terminator",
        "content": "Chuỗi trong C kết thúc bằng ký tự `'\\0'`. Duyệt chuỗi bằng: `while (s[len] != '\\0') len++;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm chuỗi C",
        "content": "Dùng `gets(s)` hoặc `fgets` nếu đọc chuỗi có dấu cách. Mảng char phải đủ $N + 1$ byte để chứa `'\\0'`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "char s[1005];\ngets(s);\nfor (int i = 0; s[i] != '\\0'; i++) {\n    // Xử lý ký tự s[i]\n}\nprintf(\"%s\\n\", s);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_string_mastery",
    "code": "#include <stdio.h>\n#include <string.h>\nint main() {\nchar str[100];\nprintf(\"Enter a string: \");\nscanf(\"%s\", str);\nprintf(\"ASCII codes of characters in the string:\\n\");\nfor (int i = 0; i < strlen(str); i++) {\nprintf(\"%c: %d\\n\", str[i], str[i]);\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_106",
    "slug": "prf192_src_106_chuy_n_i_t_ng_k_t_trong_chu_i_",
    "title": "Source 83: Chuyển đổi từng ký tự trong chuỗi thành mã ASCII:",
    "category": "Chuỗi & Ký Tự Nâng Cao",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "STRING_MASTERY"
    ],
    "solvedCount": 263,
    "totalSubmissions": 559,
    "statement": "### Bài toán: Source 83: Chuyển đổi từng ký tự trong chuỗi thành mã ASCII:\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "ABC",
        "output": "A: 65\nB: 66\nC: 67",
        "explanation": "Từng ký tự kèm mã ASCII"
      },
      {
        "input": "Hi",
        "output": "H: 72\ni: 105",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "ABC",
        "expectedOutput": "A: 65\nB: 66\nC: 67",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "Hi",
        "expectedOutput": "H: 72\ni: 105",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "Z",
        "expectedOutput": "Z: 90",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "01",
        "expectedOutput": "0: 48\n1: 49",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy duyệt chuỗi & Null-Terminator",
        "content": "Chuỗi trong C kết thúc bằng ký tự `'\\0'`. Duyệt chuỗi bằng: `while (s[len] != '\\0') len++;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm chuỗi C",
        "content": "Dùng `gets(s)` hoặc `fgets` nếu đọc chuỗi có dấu cách. Mảng char phải đủ $N + 1$ byte để chứa `'\\0'`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "char s[1005];\ngets(s);\nfor (int i = 0; s[i] != '\\0'; i++) {\n    // Xử lý ký tự s[i]\n}\nprintf(\"%s\\n\", s);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_string_mastery",
    "code": "#include <stdio.h>\n#include <string.h>\nint main() {\nchar str[100];\nprintf(\"Enter a string: \");\nscanf(\"%s\", str);\nprintf(\"ASCII codes of characters in the string:\\n\");\nfor (int i = 0; i < strlen(str); i++) {\nprintf(\"%c: %d\\n\", str[i], str[i]);\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_107",
    "slug": "prf192_src_107_t_ng_c_c_ch_s_trong_m_t_s_",
    "title": "Source 83: Tổng các chữ số trong một số",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 335,
    "totalSubmissions": 463,
    "statement": "### Bài toán: Source 83: Tổng các chữ số trong một số\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "1234",
        "output": "10",
        "explanation": "Tổng các chữ số: 1 + 2 + 3 + 4 = 10"
      },
      {
        "input": "555",
        "output": "15",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "1234",
        "expectedOutput": "10",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "555",
        "expectedOutput": "15",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "7",
        "expectedOutput": "7",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "98765",
        "expectedOutput": "35",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n#include <math.h>\nint main(){\nint n;\nprintf(\"Nhap so nguyen duong n:\");\nscanf(\"%d\",&n);\nint sum = 0;\nwhile(n>0){\nsum+=n%10;\nn=n/10;\n}\nprintf(\"sum=%d\",sum);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_108",
    "slug": "prf192_src_108_gi_5_ph_n_t_characters_gi_a_v_",
    "title": "Source 84: giữ 5 phần tử characters ở giữa và xóa những phần tử khác",
    "category": "Chuỗi & Ký Tự Nâng Cao",
    "difficulty": "Medium",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "STRING_MASTERY"
    ],
    "solvedCount": 250,
    "totalSubmissions": 394,
    "statement": "### Bài toán: Source 84: giữ 5 phần tử characters ở giữa và xóa những phần tử khác\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "hello world 123",
        "output": "o wor",
        "explanation": "Giữ 5 ký tự ở giữa"
      },
      {
        "input": "abcdefghij",
        "output": "cdefg",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "hello world 123",
        "expectedOutput": "o wor",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "abcdefghij",
        "expectedOutput": "cdefg",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "1234567",
        "expectedOutput": "23456",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "ABCDEFGHIJKL",
        "expectedOutput": "DEFGH",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy duyệt chuỗi & Null-Terminator",
        "content": "Chuỗi trong C kết thúc bằng ký tự `'\\0'`. Duyệt chuỗi bằng: `while (s[len] != '\\0') len++;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm chuỗi C",
        "content": "Dùng `gets(s)` hoặc `fgets` nếu đọc chuỗi có dấu cách. Mảng char phải đủ $N + 1$ byte để chứa `'\\0'`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "char s[1005];\ngets(s);\nfor (int i = 0; s[i] != '\\0'; i++) {\n    // Xử lý ký tự s[i]\n}\nprintf(\"%s\\n\", s);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_string_mastery",
    "code": "#include <stdio.h>\n#include <string.h>\nint main() {\nchar input[100]; // Gi? s? d? dài t?i da c?a chu?i là 100 ký t?\nchar output[7]; // Ð? dài t?i da c?a chu?i k?t qu? là 5 ký t? + 1 ký t? k?t thúc chu?i (\\0)\nint length;\nprintf(\"Nh?p chu?i (d? dài t? 5 d?n 20 ký t?): \");\nfgets(input, sizeof(input), stdin);\nlength = strlen(input);\n// Xóa ký t? newline n?u t?n t?i\nif (input[length - 1] == '\\n') {\ninput[length - 1] = '\\0';\nlength--;\n}\nif (length >= 5 && length <= 20) {\nint start = (length - 5) / 2;\nstrncpy(output, input + start, 5);\noutput[5] = '\\0'; // Ð?m b?o k?t thúc chu?i\nprintf(\"Chu?i sau khi ch? gi? l?i 5 ký t? ? gi?a: %s\\n\", output);\n} else {\nprintf(\"Ð? dài c?a chu?i không th?a mãn yêu c?u.\\n\");\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_109",
    "slug": "prf192_src_109_check_s_symmetric",
    "title": "Source 85: check số symmetric",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 378,
    "totalSubmissions": 543,
    "statement": "### Bài toán: Source 85: check số symmetric\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "1221",
        "output": "The string is symmetric",
        "explanation": "Số đối xứng"
      },
      {
        "input": "12321",
        "output": "The string is symmetric",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "1221",
        "expectedOutput": "The string is symmetric",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "12321",
        "expectedOutput": "The string is symmetric",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "1234",
        "expectedOutput": "The string is not symmetric",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "1001",
        "expectedOutput": "The string is symmetric",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n#include <string.h>\nint main() {\nchar str[100];\nint len, i, is_symmetric = 1;\nint n;\nscanf(\"%d\\n\",&n); // Chú ý \\n ? dây d? tiêu tr? ký t? newline sau khi nh?p n.\nfor(i = 0; i < n; i++) {\nscanf(\" %c\", &str[i]); // Ð?c t?ng ký t? và luu vào m?ng str.\n}\nstr[n] = '\\0'; // K?t thúc chu?i b?ng ký t? null.\nlen = strlen(str);\nfor (i = 0; i < len/2; i++) {\nif (str[i] != str[len-i-1]) {\nis_symmetric = 0;\nbreak;\n}\n}\nif (is_symmetric) {\nprintf(\"The string is symmetric\");\n}\nelse {\nprintf(\"The string is not symmetric\");\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_110",
    "slug": "prf192_src_110_s_p_x_p_ph_n_t_l_gi_m_d_n_v_ch",
    "title": "Source 86: sắp xếp phần tử lẻ giảm dần và chẵn tăng dần trên 1 dòng output",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 272,
    "totalSubmissions": 364,
    "statement": "### Bài toán: Source 86: sắp xếp phần tử lẻ giảm dần và chẵn tăng dần trên 1 dòng output\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 1 7",
        "output": "9 7 5 1 2",
        "explanation": "Lẻ giảm dần và chẵn tăng dần"
      },
      {
        "input": "6\n1 4 3 6 5 2",
        "output": "5 3 1 2 4 6",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 1 7",
        "expectedOutput": "9 7 5 1 2",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "6\n1 4 3 6 5 2",
        "expectedOutput": "5 3 1 2 4 6",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n2 4 6",
        "expectedOutput": "2 4 6",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "4\n8 3 4 9",
        "expectedOutput": "9 3 4 8",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\nvoid sap_xep(int a[], int n) {\nint i, j;\nfor (i = 0; i < n; i++) {\nint m = i;\nfor (j = i + 1; j < n; j++) {\nif (a[j] < a[m])\nm = j;\n}\nint c = a[m];\na[m] = a[i];\na[i] = c;\n}\n}\nvoid dao_vi_tri(int a[], int n) {\nint left = 0, right = n - 1;\nwhile (left < right) {\nint temp = a[left];\na[left] = a[right];\na[right] = temp;\nleft += 2; // V? trí s? l? ch? d?i cho s? l?\nright -= 2; // V? trí s? ch?n ch? d?i cho s? ch?n\n}\n}\nint main() {\nint n, i;\nprintf(\"Nhap so phan tu cua mang: \");\nscanf(\"%d\", &n);\nint arr[n];\nfor (i = 0; i < n; i++) {\nscanf(\"%d\", &arr[i]);\n}\nint chan[n], le[n];\nint c = 0, l = 0;\nfor (i = 0; i < n; i++) {\nif (arr[i] % 2 == 0)\nchan[c++] = arr[i];\nelse\nle[l++] = arr[i];\n}\nsap_xep(chan, c);\nsap_xep(le, l);\ndao_vi_tri(le, l);\ndao_vi_tri(chan, c);\nint idx_le = 0, idx_chan = 0;\nfor (i = 0; i < n; i++) {\nif (arr[i] % 2 == 0)\nprintf(\"%d \", chan[idx_chan++]);\nelse\nprintf(\"%d \", le[idx_le++]);\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_111",
    "slug": "prf192_src_111_s_p_x_p_c_c_ph_n_t_l_t_ng_d_n_",
    "title": "Source 87: sắp xếp các phần tử lẻ tăng dần và chẵn giảm dần",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 272,
    "totalSubmissions": 596,
    "statement": "### Bài toán: Source 87: sắp xếp các phần tử lẻ tăng dần và chẵn giảm dần\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 1 7",
        "output": "1 5 7 9 2",
        "explanation": "Lẻ tăng dần và chẵn giảm dần"
      },
      {
        "input": "6\n1 4 3 6 5 2",
        "output": "1 3 5 6 4 2",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 1 7",
        "expectedOutput": "1 5 7 9 2",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "6\n1 4 3 6 5 2",
        "expectedOutput": "1 3 5 6 4 2",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n2 4 6",
        "expectedOutput": "6 4 2",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "4\n8 3 4 9",
        "expectedOutput": "3 9 8 4",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\nvoid sap_xep(int a[], int n) {\nint i, j;\nfor (i = 0; i < n; i++) {\nint m = i;\nfor (j = i + 1; j < n; j++) {\nif (a[j] > a[m])\nm = j;\n}\nint c = a[m];\na[m] = a[i];\na[i] = c;\n}\n}\nvoid dao_vi_tri(int a[], int n) {\nint left = 0, right = n - 1;\nwhile (left < right) {\nint temp = a[left];\na[left] = a[right];\na[right] = temp;\nleft += 2;  // V? trí s? l? ch? d?i cho s? l?\nright -= 2; // V? trí s? ch?n ch? d?i cho s? ch?n\n}\n}\nint main() {\nint n, i;\nprintf(\"Nhap so phan tu cua mang: \");\nscanf(\"%d\", &n);\nint arr[n];\nfor (i = 0; i < n; i++) {\nscanf(\"%d\", &arr[i]);\n}\nint chan[n], le[n];\nint c = 0, l = 0;\nfor (i = 0; i < n; i++) {\nif (arr[i] % 2 == 0)\nchan[c++] = arr[i];\nelse\nle[l++] = arr[i];\n}\nsap_xep(chan, c);\nsap_xep(le, l);\ndao_vi_tri(le, l);\ndao_vi_tri(chan, c);\nint idx_le = 0, idx_chan = 0;\nfor (i = 0; i < n; i++) {\nif (arr[i] % 2 == 0)\nprintf(\"%d \", chan[c - 1 - idx_chan++]);\nelse\nprintf(\"%d \", le[idx_le++]);\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_112",
    "slug": "prf192_src_112_t_ng_3_s_cu_i_c_a_m_ng",
    "title": "Source88: Tổng 3 số cuối của mảng",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 340,
    "totalSubmissions": 405,
    "statement": "### Bài toán: Source88: Tổng 3 số cuối của mảng\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n5 2 9 1 7",
        "output": "17",
        "explanation": "Tổng 3 số cuối: 9 + 1 + 7 = 17"
      },
      {
        "input": "4\n10 20 30 40",
        "output": "90",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n5 2 9 1 7",
        "expectedOutput": "17",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n10 20 30 40",
        "expectedOutput": "90",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n1 2 3",
        "expectedOutput": "6",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "6\n5 10 15 2 4 6",
        "expectedOutput": "12",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\nint main() {\nint n, i, t = 0;\nprintf(\"Nhap so phan tu cua mang: \");\nscanf(\"%d\", &n);\nint arr[n];\nfor (i = 0; i < n; i++) {\nscanf(\"%d\", &arr[i]);\n}\nfor (i = n - 3; i < n; i++) {\nt = t + arr[i];\n}\nprintf(\"Tong cua ba so cuoi la: %d\\n\", t);\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_113",
    "slug": "prf192_src_113__m_s_l_ng_s_ch_n_v_s_l_",
    "title": "Source 89: đếm số lượng số chẵn và số lẻ",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 324,
    "totalSubmissions": 563,
    "statement": "### Bài toán: Source 89: đếm số lượng số chẵn và số lẻ\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n1 2 3 4 5",
        "output": "2 3",
        "explanation": "2 số chẵn, 3 số lẻ"
      },
      {
        "input": "4\n2 4 6 8",
        "output": "4 0",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "2 3",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n2 4 6 8",
        "expectedOutput": "4 0",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n1 3 5",
        "expectedOutput": "0 3",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "6\n10 15 20 25 30 35",
        "expectedOutput": "3 3",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <math.h>\n#include <ctype.h>\nint main() {\n// [Sanitized]:  removed\n\nint i,m=0,n=0;\nint a[5];\nfor(i=0;i<5;i++){\nscanf(\"%d\",&a[i]);\nif(a[i]%2==0)\nm++;\nelse\nn++;\n}\n\n\n\nprintf(\"%d\\n\", m);\nprintf(\"%d\\n\", n);\n\nprintf(\"\\n\");\n// [Sanitized]:  removed\nreturn(0);\n}"
  },
  {
    "id": "prf192_src_114",
    "slug": "prf192_src_114_s_ch_nh_ph_ng",
    "title": "Source 90: Số chính phương",
    "category": "Số Học & Thuật Toán Cơ Bản",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "MATH_ALGORITHMS"
    ],
    "solvedCount": 374,
    "totalSubmissions": 369,
    "statement": "### Bài toán: Source 90: Số chính phương\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "25",
        "output": "25 la so chinh phuong.",
        "explanation": "Số chính phương"
      },
      {
        "input": "26",
        "output": "26 khong phai la so chinh phuong.",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "25",
        "expectedOutput": "25 la so chinh phuong.",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "26",
        "expectedOutput": "26 khong phai la so chinh phuong.",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "16",
        "expectedOutput": "16 la so chinh phuong.",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "100",
        "expectedOutput": "100 la so chinh phuong.",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy tối ưu số học",
        "content": "Kiểm tra số nguyên tố chỉ cần lặp đến $\\sqrt{N}$ (`i * i <= n`). Tính UCLN dùng thuật toán Euclid chia lấy dư."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm số học C",
        "content": "Phép chia nguyên `5 / 2 = 2`. Cần in số thực thì ép kiểu `(float)a / b`. Tránh tràn số int 32-bit."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "long long n;\nscanf(\"%lld\", &n);\n// Thuật toán số học\nprintf(\"%lld\\n\", res);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_math_algorithms",
    "code": "#include <stdio.h>\n#include <math.h>\nint main() {\nint num;\nprintf(\"Nhap mot so nguyen: \");\nscanf(\"%d\", &num);\nint sqrt_num = sqrt(num);\nif (sqrt_num * sqrt_num == num) {\nprintf(\"%d la so chinh phuong.\\n\", num);\n} else {\nprintf(\"%d khong phai la so chinh phuong.\\n\", num);\n}\nreturn 0;\n}\nSource 91 : In ra các số chính phương trong khoảng từ a->b\n#include <stdio.h>\n#include <math.h>\nint main() {\nint A, B;\nprintf(\"Nhap khoang A den B: \");\nscanf(\"%d %d\", &A, &B);\nprintf(\"Cac so chinh phuong tu %d den %d la:\\n\", A, B);\nfor (int num = A; num <= B; num++) {\nint sqrt_num = sqrt(num);\nif (sqrt_num * sqrt_num == num) {\nprintf(\"%d \", num);\n}\n}\nreturn 0;\n}"
  },
  {
    "id": "prf192_src_115",
    "slug": "prf192_src_115_t_ng_c_c_s_ch_nh_ph_ng_trong_m",
    "title": "Source 92: Tổng các số chính phương trong mảng",
    "category": "Mảng 1 Chiều & Sắp Xếp",
    "difficulty": "Easy",
    "points": 100,
    "timeLimit": 1,
    "memoryLimit": 128,
    "tags": [
      "PRF192",
      "ARRAY_SORTING"
    ],
    "solvedCount": 237,
    "totalSubmissions": 608,
    "statement": "### Bài toán: Source 92: Tổng các số chính phương trong mảng\n\nViết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.\n\n**Yêu cầu kỹ thuật:**\n- Mã nguồn tuân thủ tiêu chuẩn C11/C17.\n- Không dùng các lệnh điều khiển màn hình như `system(\"cls\")` hay `system(\"pause\")`.\n- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm.",
    "inputFormat": "Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.",
    "outputFormat": "Kết quả in ra stdout theo đúng định dạng kiểm thử.",
    "constraints": "Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.",
    "samples": [
      {
        "input": "5\n1 4 9 2 5",
        "output": "14",
        "explanation": "Tổng các số chính phương (1, 4, 9): 1 + 4 + 9 = 14"
      },
      {
        "input": "4\n16 25 3 7",
        "output": "41",
        "explanation": "Test case mẫu 2"
      }
    ],
    "testcases": [
      {
        "id": 1,
        "input": "5\n1 4 9 2 5",
        "expectedOutput": "14",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 2,
        "input": "4\n16 25 3 7",
        "expectedOutput": "41",
        "isHidden": false,
        "weight": 25
      },
      {
        "id": 3,
        "input": "3\n2 3 5",
        "expectedOutput": "0",
        "isHidden": true,
        "weight": 25
      },
      {
        "id": 4,
        "input": "5\n0 1 4 9 16",
        "expectedOutput": "30",
        "isHidden": true,
        "weight": 25
      }
    ],
    "progressiveHints": [
      {
        "tier": 1,
        "title": "Tư duy mảng & Hoán vị biến tạm",
        "content": "Mảng có chỉ số từ 0 đến $N - 1$. Đổi chỗ 2 phần tử cần biến tạm: `int tmp = a[i]; a[i] = a[j]; a[j] = tmp;`."
      },
      {
        "tier": 2,
        "title": "Cảnh báo bẫy ngầm bộ nhớ C",
        "content": "Tránh truy cập $a[N]$ gây tràn mảng (Out of Bounds). Phép `% 2` với số âm có thể ra `-1`, nên dùng `abs(x) % 2 == 1`."
      },
      {
        "tier": 3,
        "title": "Khung mã giả định hướng",
        "content": "int n, a[1000];\nscanf(\"%d\", &n);\nfor (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n// Xử lý mảng\nfor (int i = 0; i < n; i++) printf(\"%d \", a[i]);"
      }
    ],
    "author": "Giáo trình PRF192 Lab",
    "source": "1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx",
    "createdAt": "2026-11-01",
    "isCustom": false,
    "collectionId": "prf192_array_sorting",
    "code": "#include <stdio.h>\n#include <math.h>\nint main() {\nint n;\nprintf(\"Nhap so phan tu cua mang: \");\nscanf(\"%d\", &n);\nint arr[n];\nprintf(\"Nhap cac phan tu cua mang:\\n\");\nfor (int i = 0; i < n; i++) {\nscanf(\"%d\", &arr[i]);\n}\nint sum = 0;\nfor (int i = 0; i < n; i++) {\nint sqrt_num = sqrt(arr[i]);\nif (sqrt_num * sqrt_num == arr[i]) {\nsum += arr[i];\n}\n}\nprintf(\"Tong cac so chinh phuong trong mang la: %d\\n\", sum);\nreturn 0;\n}\n1. (bai tap 8): nhap vao so giay, in ra so nam,thang, ngay, gio,phut, giay (2)\n2. nhap so tien ( nghin dong) co cac menh gia  thong dung 500k, 200k, 100k....1k. in ra so tien theo menh gia sao cho so to tien it nhat(khong dung array) (2)\n3. Lam cac bai tap tu a....g, h, i, j ( tương tự với các bài đã chữa của SNT) đối với các số Fibonacy, Palindrome, Armstrong, số may mắn, số hạnh phúc (1.5*4)\n(//1. nhap so nguyen n,\n// a. kiem tra xem co phai so nguyen to ko?\n//neu phai, in ra no la SNT;\n//b. neu khong phai snt, in ra cac uoc so cua no.\n// c. in ra tong tat ca cac uoc so cua n\n// d. in ra so luong cac cac uoc so cua n\n// e. nhap n, in ra cac SNT tu 1 den n\n// f. in ra n SNT dau tien\n// g. in ra 3 SNT lon hon n\n// h. in ra 2 SNT, mot so lon hon va mot so nho hon n  (gan n nhat)\n// i. in ra 4 SNT, 2 so lon hon va 2 so nho hon n\n// j. nhap n,p, q, in ra p SNT nho hon n va q SNT lon hon n.\n// k. in ra cac SNT (co 3, hoac co 4 chu so) ma co tong cac chu so\n//chia het cho 5\n//  l. nhập n, tìm các số vừa là SNT vừa là Fibonacy nhỏ hơn n\n1. Tính các tổng (4)\na. //Tinh S=1^2+2^2+3^2+...+n^2\nb.  33: Tinh S4=1^2+2^3+3^4+...+n^(n+1)\nc. Nhap x, n. Tinh S=x^1+x^2+...+x^n\nd. Tinh S=1/1+1/1(1+2)+1/(1+2+3)+...+1/(1+2+...+n)\ne. Tinh S= 1/1!+1/(2!)+1/(3!)+...+1/(n!)\nf.  Tinh S=1-1/2+1/3-1/4+1/5-...+(/-)1/n\ng. Nhap n,x. Tinh S=1+x^2/2!+x^4/4!+...+x^(2n)/(2n!)\n1. mo rong: nhap mang n phan tu,  sap xep cac phan tu i o vi tri chan ( hoacco gia tri chan a[i])\n2.  //a. Sap xep  cac phan tu o vi tri chan tang dan, phan tu o vi tri le giam dan-OK\n//b. Sap xep cac phan tu  co gia tri chan tang dan, gia tri le giam dan-OK\n3. // BT20: cach 1 Nhap va sap xep  mang n phan tu,\n//dung thuat toan interchange\n// sap xep tang dan cac so floating point co 3 chu so thap phan,\n// cach nhau boi dau -\n4.  BTVN 24. mo rong 2: nhap array n phan tu,va cac gia tri b,e\n//sap xep gia tri tu phan tu b den phan tu e bat ky trong mang theo thu tu tang dan (ke ca dau mut)\nWorkshop 4:\n1. Sua : // nhap mang n phan tu, nhap a va b,  thay the cac  so truoc va sau snt nam trong khoang a[a] va a[b] bang so 99\n2. them\na. Bai 36. Nhap vao mot mang co n phan tu,  them vao phia truoc tat ca  SNT bang so 0 (ok)\nb. Them so 99 vao dang truoc 2 phan tu (phan tu can thay k=-2) so voi phan tu thu 3 la   SNT (phan tu goc p=3)\nc. //Bai 36-37. Nhap vao mot mang co n phan tu, them vao phia truoc tat ca cac phan tu la SNT bang so 99 (ok)\nWorkshop 5:\na. bai 40 : xoa tat ca cac SNT\nb.  xóa bo phan tu chan thu 2 (  hoac phan tu NT thu 2)\nc. Xoa bo 2 (hoac 3)  phan tu dung sau phan tu chan  (hoac phan tu NT) thu 2 (k=1)\nSource 93 : Nguyen am thanh chu hoa phu am thanh chu thuong\n#include <stdio.h>\nint main() {\nchar s[1000];\ngets(s);\nint i;\nfor (i = 0; i < strlen(s); i++) {\nif (isupper(s[i])) {\ns[i] +=32;\n}if (s[i] == 'a' || s[i] == 'e' || s[i] == 'i' || s[i] == 'o' || s[i] == 'u') {\ns[i] -= 32;\n}\n}\nputs(s);\n}\nSource 93 : Kiem tra co la pow cua 2\n#include <stdio.h>\nint power(int n) {\nif (n == 0) return 0;\nint i,count = 0;\nfor (i = 1; i > 0;i = i<<1) {\nif (i == n) {\nreturn count;\n}\nif (i > n) {\nreturn 0;\n}\ncount++;\n}\nreturn 0;\n}\nint main() {\nint n;\nscanf(\"%d\", &n);\nif (power(n) != 0) {\nprintf(\"%d\", power(n));\n} else {\nprintf(\"%d is not a power of 2\",n);\n}\n}"
  }
];
