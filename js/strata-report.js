/* ==========================================================================
   Strata 评分报告 —— 交互逻辑（仅在本文章加载）
   数据与口径来自原报告；配色改为博客主题色，并跟随明暗模式
   ========================================================================== */
(function () {
  'use strict';

  var mtx = document.getElementById('srMatrix');
  if (!mtx || !document.getElementById('srRank')) return;

  /* ------------------------------ 数据 ------------------------------ */
  // cap: [通用知识, 科学数学, 代码Agent, 工具长文, 中文指令]  0-100
  var DATA = [
    // ---- Qwen3.8-Flash-Next ----
    { fam: 'Qwen3.8-Flash-Next', pkg: 'ISTA Q2_0', short: 'Q2_0', gpu: 'RTX 5070 12G + R5 7600 + 64G', plat: 'NVIDIA', vram: 12, ram: 64, ngpu: 1, spd: 94, pre: 2650, fit: 100, est: false, cap: [76, 80, 80, 74, 74], note: '官方基准机；4K 94.6 / 128K 65.1' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'ISTA Q2_0', short: 'Q2_0', gpu: 'RX 9070 XT 16G + 3900X + 47G', plat: 'AMD', vram: 16, ram: 47, ngpu: 1, spd: 60, pre: 1160, fit: 100, est: false, cap: [76, 80, 80, 74, 74], note: 'A 卡官方对照' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'ISTA Q2_0', short: 'Q2_0', gpu: 'RTX 5090 32G + 64G', plat: 'NVIDIA', vram: 32, ram: 64, ngpu: 1, spd: 153, pre: 5779, fit: 100, est: false, cap: [76, 80, 80, 74, 74], note: 'Q2_0+MTP；IQ2_XS 同机 179.4@4K' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'ISTA IQ2_XS', short: 'IQ2_XS', gpu: 'RTX 5070 12G + 64G', plat: 'NVIDIA', vram: 12, ram: 64, ngpu: 1, spd: 79, pre: 2090, fit: 100, est: false, cap: [78, 81, 82, 76, 76], note: '官方推荐；4K 78.0 / 128K 52.0' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'ISTA IQ2_XS', short: 'IQ2_XS', gpu: 'RX 9070 XT 16G + 47G', plat: 'AMD', vram: 16, ram: 47, ngpu: 1, spd: 52, pre: 1110, fit: 100, est: false, cap: [78, 81, 82, 76, 76], note: '' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'ISTA IQ2_XS', short: 'IQ2_XS', gpu: 'RTX 5090 32G + 64G', plat: 'NVIDIA', vram: 32, ram: 64, ngpu: 1, spd: 179, pre: 5779, fit: 100, est: false, cap: [78, 81, 82, 76, 76], note: '4K 179.4 / 32K 175.7 / 128K 165.0' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'ISTA IQ3_XXS', short: 'IQ3_XXS', gpu: 'RTX 5070 12G + 64G', plat: 'NVIDIA', vram: 12, ram: 64, ngpu: 1, spd: 62, pre: 1750, fit: 100, est: false, cap: [84, 88, 88, 84, 83], note: '数学满分档；4K 65.6 / 128K 44.8' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'ISTA IQ3_S', short: 'IQ3_S', gpu: 'RTX 5070 12G + 64G', plat: 'NVIDIA', vram: 12, ram: 64, ngpu: 1, spd: 53, pre: 1620, fit: 100, est: false, cap: [87, 91, 90, 88, 86], note: '官方称公开测试与完整模型相当（top-1 一致率 87.7%）' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'ISTA IQ3_S', short: 'IQ3_S', gpu: 'RTX 5070 Ti 16G', plat: 'NVIDIA', vram: 16, ram: 64, ngpu: 1, spd: 50, pre: 3487, fit: 100, est: true, cap: [87, 91, 90, 88, 86], note: '社区区间 43-57，取中位' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'ISTA IQ3_S', short: 'IQ3_S', gpu: 'RTX 4090 Laptop 16G', plat: 'NVIDIA', vram: 16, ram: 64, ngpu: 1, spd: 47, pre: 2506, fit: 100, est: true, cap: [87, 91, 90, 88, 86], note: '笔记本 GPU；社区 43-51' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'ISTA IQ3_S', short: 'IQ3_S', gpu: 'RTX 3090 24G + 128G', plat: 'NVIDIA', vram: 24, ram: 128, ngpu: 1, spd: 100, pre: 2200, fit: 100, est: true, cap: [87, 91, 90, 88, 86], note: '官方预估 100-140；长文 65-70，代码峰值 120+' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'ISTA IQ3_S', short: 'IQ3_S', gpu: 'RTX PRO 5000 72G', plat: 'NVIDIA', vram: 72, ram: 128, ngpu: 1, spd: 199, pre: 2939, fit: 100, est: false, cap: [87, 91, 90, 88, 86], note: '0.2.19：212.8 tok/s；0.2.21 预填 6967（UD-Q4_K_XL）' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'ISTA IQ3_S', short: 'IQ3_S', gpu: 'RTX 5090 32G + 64G', plat: 'NVIDIA', vram: 32, ram: 64, ngpu: 1, spd: 197, pre: 6000, fit: 100, est: false, cap: [87, 91, 90, 88, 86], note: '0.2.19 实测 199.4→212.8' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'Coder IQ1_M', short: 'Coder', gpu: 'RTX 5070 12G + 64G', plat: 'NVIDIA', vram: 12, ram: 64, ngpu: 1, spd: 55, pre: 2180, fit: 100, est: false, cap: [62, 66, 86, 70, 48], note: '砍半专家；SWE-bench 达完整版 91%，但中文/CJK 明显劣化' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'Coder IQ1_M', short: 'Coder', gpu: 'RX 9070 XT 16G + 47G', plat: 'AMD', vram: 16, ram: 47, ngpu: 1, spd: 44, pre: 1420, fit: 100, est: false, cap: [62, 66, 86, 70, 48], note: '' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'Coder IQ1_M', short: 'Coder', gpu: '2× RTX 3090 24G + EPYC 7453 + 165G', plat: 'NVIDIA', vram: 24, ram: 165, ngpu: 2, spd: 103, pre: 2160, fit: 100, est: false, cap: [62, 66, 86, 70, 48], note: '单卡 66.8 → 双卡 auto 98.6 / 固定 K=22 103.3' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'Gyro-M', short: 'Gyro-M', gpu: 'RTX 2000 Ada 16G + 64G DDR4', plat: 'NVIDIA', vram: 16, ram: 64, ngpu: 1, spd: 55, pre: 1025, fit: 100, est: false, cap: [80, 82, 83, 80, 78], note: 'TQ2_0 9.2GB；长文检索 15/15、推理 85.4%、HumanEval 99%、Blender 工具调用不崩' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'Gyro-S', short: 'Gyro-S', gpu: '2× RTX A6000 48G', plat: 'NVIDIA', vram: 48, ram: 128, ngpu: 2, spd: 76, pre: 1500, fit: 100, est: false, cap: [72, 74, 78, 72, 70], note: '0.2.14 双卡分层修复后 64.2→75.9；最小可运行档，质量较低' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'Unsloth UD-IQ4_XS', short: 'UD-IQ4_XS', gpu: 'RTX 3060 12G', plat: 'NVIDIA', vram: 12, ram: 48, ngpu: 1, spd: 30, pre: 264, fit: 70, est: true, cap: [90, 93, 92, 91, 89], note: '0.2.12 后 2K 预填 87→264；<80GB 内存需 SSD 流式' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'Unsloth UD-Q4_K_XL', short: 'UD-Q4_K_XL', gpu: 'Mac M5 Max 128G', plat: 'Apple', vram: 128, ram: 128, ngpu: 1, spd: 95, pre: 1605, fit: 100, est: false, cap: [93, 94, 94, 93, 92], note: 'top-1 一致率 93.1%；0.2.12 输出 +12.7%' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'Unsloth UD-Q4_K_XL', short: 'UD-Q4_K_XL', gpu: 'Strix Halo 128G', plat: 'Strix Halo', vram: 115, ram: 128, ngpu: 1, spd: 54, pre: 1267, fit: 100, est: false, cap: [93, 94, 94, 93, 92], note: 'Vulkan；代码 +24%、工具调用 -5.8%（0.2.12）' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'Unsloth UD-Q4_K_XL', short: 'UD-Q4_K_XL', gpu: 'RTX 5090 32G + 64G', plat: 'NVIDIA', vram: 32, ram: 64, ngpu: 1, spd: 116, pre: 3206, fit: 70, est: false, cap: [93, 94, 94, 93, 92], note: '0.2.19：135.3→161.6（2K）；64GB 上专家需 SSD 兜底' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'Unsloth UD-Q4_K_XL', short: 'UD-Q4_K_XL', gpu: '2× RTX 4090 24G', plat: 'NVIDIA', vram: 24, ram: 128, ngpu: 2, spd: 76, pre: 2526, fit: 100, est: false, cap: [93, 94, 94, 93, 92], note: '0.2.19 agent 8K：47.8→76.2（+59%）' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'Unsloth UD-Q4_K_XL', short: 'UD-Q4_K_XL', gpu: '4× RTX 4090 24G', plat: 'NVIDIA', vram: 24, ram: 256, ngpu: 4, spd: 152, pre: 12000, fit: 100, est: false, cap: [93, 94, 94, 93, 92], note: '单流 152.1；8 并发聚合 507.8' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'Unsloth UD-Q4_K_XL', short: 'UD-Q4_K_XL', gpu: '4× RTX 5090 32G', plat: 'NVIDIA', vram: 32, ram: 256, ngpu: 4, spd: 274, pre: 14000, fit: 100, est: false, cap: [93, 94, 94, 93, 92], note: '单流 253-294（较 4090 +93%）；16 并发 1132' },
    { fam: 'Qwen3.8-Flash-Next', pkg: 'Unsloth UD-Q4_K_XL', short: 'UD-Q4_K_XL', gpu: '3× Tesla V100 32G (PCIe3)', plat: 'NVIDIA', vram: 32, ram: 256, ngpu: 4, spd: 374, pre: 3667, fit: 45, est: false, cap: [93, 94, 94, 93, 92], note: '社区自编译；代码 366.9-381.6，散文仅 134-140。单卡时 CPU 协同 109.7 反超纯 PCIe 37.9' },
    { fam: 'Qwen3.8-Flash-Next', pkg: '8GB 极限降级（五级）', short: '8GB降级', gpu: '8GB 显存 + 64G', plat: 'NVIDIA', vram: 8, ram: 64, ngpu: 1, spd: 24, pre: 800, fit: 70, est: false, cap: [76, 80, 80, 74, 74], note: '128K 上下文保住，代价：专家槽 128→16、卸载 MTP 换 DFlash2、输出头进锁页内存、速度打 3 折；<64GB 内存直接跌破 5 tok/s' },
    // ---- Qwen3.6-35B-A3B ----
    { fam: 'Qwen3.6-35B-A3B', pkg: 'UD-Q4_K_XL', short: 'UD-Q4_K_XL', gpu: 'RTX 3060 12G + 44G', plat: 'NVIDIA', vram: 12, ram: 44, ngpu: 1, spd: 65, pre: 2216, fit: 100, est: true, cap: [79, 78, 88, 72, 80], note: '官方区间 50-80；最低 8GB 显存 + 32GB 内存可跑' },
    { fam: 'Qwen3.6-35B-A3B', pkg: 'UD-Q4_K_XL', short: 'UD-Q4_K_XL', gpu: 'RTX 4080 16G + 64G', plat: 'NVIDIA', vram: 16, ram: 64, ngpu: 1, spd: 120, pre: 3400, fit: 100, est: true, cap: [79, 78, 88, 72, 80], note: '官方区间 80-160，4K 预填 3400+' },
    { fam: 'Qwen3.6-35B-A3B', pkg: 'UD-Q4_K_XL', short: 'UD-Q4_K_XL', gpu: 'RTX 3090 24G', plat: 'NVIDIA', vram: 24, ram: 64, ngpu: 1, spd: 102, pre: 2500, fit: 100, est: false, cap: [79, 78, 88, 72, 80], note: 'llamaperf 实测 101.7' },
    { fam: 'Qwen3.6-35B-A3B', pkg: 'UD-Q4_K_XL', short: 'UD-Q4_K_XL', gpu: 'RX 7900 XTX 24G', plat: 'AMD', vram: 24, ram: 64, ngpu: 1, spd: 126, pre: 2800, fit: 100, est: false, cap: [79, 78, 88, 72, 80], note: '125.5；系统内存 32GB 起、推荐 ≥44GB' },
    { fam: 'Qwen3.6-35B-A3B', pkg: 'UD-Q4_K_XL', short: 'UD-Q4_K_XL', gpu: 'Strix Halo 128G', plat: 'Strix Halo', vram: 115, ram: 128, ngpu: 1, spd: 60, pre: 755, fit: 100, est: false, cap: [79, 78, 88, 72, 80], note: 'Vulkan RADV 60.4' },
    { fam: 'Qwen3.6-35B-A3B', pkg: 'UD-Q4_K_XL', short: 'UD-Q4_K_XL', gpu: 'RTX 5090 32G', plat: 'NVIDIA', vram: 32, ram: 64, ngpu: 1, spd: 215, pre: 4000, fit: 100, est: false, cap: [79, 78, 88, 72, 80], note: '215.1；无 Mac / 无 Arc 支持' },
    { fam: 'Qwen3.6-35B-A3B', pkg: 'UD-Q6_K_XL', short: 'UD-Q6_K_XL', gpu: 'RTX 4080 16G + 64G', plat: 'NVIDIA', vram: 16, ram: 64, ngpu: 1, spd: 78, pre: 3000, fit: 100, est: true, cap: [82, 81, 90, 75, 83], note: '官方 60-95；token 对齐基准 94.6%' },
    { fam: 'Qwen3.6-35B-A3B', pkg: 'Q8_0', short: 'Q8_0', gpu: 'RTX 4080 16G + 64G', plat: 'NVIDIA', vram: 16, ram: 64, ngpu: 1, spd: 55, pre: 2600, fit: 100, est: true, cap: [85, 84, 92, 78, 86], note: '官方 40-70；37.8GB 包，内存余量紧张易 swap' },
    { fam: 'Qwen3.6-35B-A3B', pkg: 'Q8_0', short: 'Q8_0', gpu: 'Mac M5 Max 36G', plat: 'Apple', vram: 36, ram: 36, ngpu: 1, spd: 178, pre: 5000, fit: 100, est: false, cap: [85, 84, 92, 78, 86], note: '178.0（llamaperf）；48GB 版 137.7' },
    { fam: 'Qwen3.6-35B-A3B', pkg: 'Q8_0', short: 'Q8_0', gpu: 'H100 80G（云）', plat: 'NVIDIA', vram: 80, ram: 128, ngpu: 1, spd: 290, pre: 11486, fit: 100, est: false, cap: [85, 84, 92, 78, 86], note: '开 MTP 508 tok/s；作为本地方案的成本对照' },
    // ---- Hy4-Flash ----
    { fam: 'Tencent Hy4-Flash', pkg: 'Strata SQ-64', short: 'SQ-64', gpu: 'RTX 5090 32G + 128G', plat: 'NVIDIA', vram: 32, ram: 128, ngpu: 1, spd: 128, pre: 4000, fit: 100, est: false, cap: [86, 78, 72, 86, 88], note: '0.2.20 从 30 → 128.25（4.27×）；磁盘 129.61GB' },
    { fam: 'Tencent Hy4-Flash', pkg: 'Strata SQ-64', short: 'SQ-64', gpu: 'RTX PRO 6000', plat: 'NVIDIA', vram: 96, ram: 128, ngpu: 1, spd: 240, pre: 6000, fit: 100, est: true, cap: [86, 78, 72, 86, 88], note: '官方峰值口径，DFly2 投机解码' },
    { fam: 'Tencent Hy4-Flash', pkg: 'Strata SQ-64', short: 'SQ-64', gpu: 'Mac M5 Max 128G', plat: 'Apple', vram: 128, ram: 128, ngpu: 1, spd: 90, pre: 3000, fit: 100, est: true, cap: [86, 78, 72, 86, 88], note: '官方 69-110 区间；8GB 显存起可跑' },
    { fam: 'Tencent Hy4-Flash', pkg: 'Strata SQ-64', short: 'SQ-64', gpu: 'RX 9070 XT / R9700 16G', plat: 'AMD', vram: 16, ram: 64, ngpu: 1, spd: 62, pre: 2000, fit: 100, est: false, cap: [86, 78, 72, 86, 88], note: '0.2.18 参考速度；最低 8GB 显存 + 64GB 内存' },
    { fam: 'Tencent Hy4-Flash', pkg: 'Strata SQ-64', short: 'SQ-64', gpu: 'DGX Spark (GB10) 128G', plat: 'Spark', vram: 128, ram: 128, ngpu: 1, spd: 44, pre: 2000, fit: 100, est: false, cap: [86, 78, 72, 86, 88], note: '43.9 tok/s；Arm 平台' },
    { fam: 'Tencent Hy4-Flash', pkg: 'Strata SQ-96', short: 'SQ-96', gpu: '8-12GB 显存 + 96G', plat: 'NVIDIA', vram: 12, ram: 96, ngpu: 1, spd: 40, pre: 1500, fit: 100, est: true, cap: [89, 81, 75, 89, 91], note: '模型 89.58GB / 磁盘 157.16GB；精度高于 SQ-64' },
    { fam: 'Tencent Hy4-Flash', pkg: 'Strata SQ-128', short: 'SQ-128', gpu: '8-12GB 显存 + 128G', plat: 'NVIDIA', vram: 12, ram: 128, ngpu: 1, spd: 32, pre: 1200, fit: 100, est: true, cap: [91, 83, 78, 91, 93], note: '模型 113.65GB / 磁盘 181.23GB；最高精度档' },
    { fam: 'Tencent Hy4-Flash', pkg: 'Strata SQ-64', short: 'SQ-64×4R9700', gpu: '4× Radeon AI PRO R9700', plat: 'AMD', vram: 32, ram: 256, ngpu: 4, spd: 80, pre: 3000, fit: 100, est: false, cap: [86, 78, 72, 86, 88], note: '0.2.9 修多卡默认只用一卡的问题后：12147/15360 专家上卡，57.7-103.7' },
    // ---- Inkling 2 Mini ----
    { fam: 'Inkling 2 Mini', pkg: 'Strata SQ-10', short: 'SQ-10', gpu: 'RTX 3060 Ti 8G', plat: 'NVIDIA', vram: 8, ram: 32, ngpu: 1, spd: 43, pre: 1200, fit: 100, est: false, cap: [74, 76, 88, 86, 46], note: '0.2.21：11→43。4GB 卡也能跑' },
    { fam: 'Inkling 2 Mini', pkg: 'Strata SQ-10', short: 'SQ-10', gpu: 'RTX 5070 12G', plat: 'NVIDIA', vram: 12, ram: 32, ngpu: 1, spd: 68, pre: 2000, fit: 100, est: false, cap: [74, 76, 88, 86, 46], note: '0.2.21：12.5→68' },
    { fam: 'Inkling 2 Mini', pkg: 'Strata SQ-10', short: 'SQ-10', gpu: 'Mac M6 Mac mini 24G', plat: 'Apple', vram: 24, ram: 24, ngpu: 1, spd: 34, pre: 564, fit: 100, est: false, cap: [74, 76, 88, 86, 46], note: '单路 33.6（k8v4 峰值）/ 4 并发 60.6；同机 Unsloth 仅 21.8，预填 2.17×' },
    { fam: 'Inkling 2 Mini', pkg: 'Strata SQ-15', short: 'SQ-15', gpu: '16GB 卡 + 32G', plat: 'NVIDIA', vram: 16, ram: 32, ngpu: 1, spd: 62, pre: 1800, fit: 100, est: true, cap: [80, 82, 91, 89, 50], note: '14.35GB，16G 卡刚好装下；与原版一致率 96.68%' },
    { fam: 'Inkling 2 Mini', pkg: 'Strata SQ-20', short: 'SQ-20', gpu: 'RTX 4090 24G + 32K 长对话', plat: 'NVIDIA', vram: 24, ram: 48, ngpu: 1, spd: 92, pre: 2500, fit: 100, est: false, cap: [88, 88, 94, 93, 54], note: '0.2.21：20→92（32K 提示后）。逐位无损档' },
    { fam: 'Inkling 2 Mini', pkg: 'Strata SQ-20', short: 'SQ-20', gpu: 'RTX 5090 Laptop 24G + 30K', plat: 'NVIDIA', vram: 24, ram: 48, ngpu: 1, spd: 72, pre: 3000, fit: 100, est: false, cap: [88, 88, 94, 93, 54], note: '0.2.21：44→72；2-3 槽 agent 85→142-152' },
    { fam: 'Inkling 2 Mini', pkg: 'Strata SQ-20', short: 'SQ-20', gpu: 'RTX 5090 32G', plat: 'NVIDIA', vram: 32, ram: 64, ngpu: 1, spd: 200, pre: 9019, fit: 100, est: false, cap: [88, 88, 94, 93, 54], note: '0.2.21：单路 176.5-250.3，64 并发总吞吐 >4000' },
    { fam: 'Inkling 2 Mini', pkg: 'Strata SQ-20', short: 'SQ-20', gpu: 'Mac M5 Max（多缓冲）', plat: 'Apple', vram: 128, ram: 128, ngpu: 1, spd: 73, pre: 4000, fit: 100, est: false, cap: [88, 88, 94, 93, 54], note: '0.2.20 多缓冲档 73.4；0.2.21 预填再 +62%' },
    { fam: 'Inkling 2 Mini', pkg: 'Unsloth UD-Q4_K_XL', short: 'UD-Q4_K_XL', gpu: 'RTX 4090 24G + 32K', plat: 'NVIDIA', vram: 24, ram: 64, ngpu: 1, spd: 92, pre: 2500, fit: 100, est: false, cap: [90, 90, 95, 94, 56], note: '0.2.21：29→92' },
    { fam: 'Inkling 2 Mini', pkg: 'Unsloth UD-Q4_K_XL', short: 'UD-Q4_K_XL', gpu: 'RTX 5090 32G', plat: 'NVIDIA', vram: 32, ram: 64, ngpu: 1, spd: 180, pre: 6967, fit: 100, est: false, cap: [90, 90, 95, 94, 56], note: '0.2.21 预填 3923→6967' },
    { fam: 'Inkling 2 Mini', pkg: 'Unsloth UD-IQ3_XXS', short: 'UD-IQ3_XXS', gpu: 'RX 7900 XT 16G', plat: 'AMD', vram: 16, ram: 64, ngpu: 1, spd: 66, pre: 2000, fit: 100, est: false, cap: [72, 74, 86, 84, 46], note: '0.2.21：4.9→66（AMD 低显存此前严重退化）' }
  ];

  var WSETS = {
    bal: { w: [.25, .20, .30, .15, .10], d: '均衡：代码 30% / 通用 25% / 科学 20%' },
    code: { w: [.10, .10, .50, .20, .10], d: '偏向代码与 Agent：代码 + 工具共 70%' },
    cn: { w: [.30, .15, .15, .10, .30], d: '偏向中文办公：通用 + 中文共 60%，Coder / Inkling 会掉队' },
    reason: { w: [.20, .40, .20, .10, .10], d: '偏向推理数学：科学 40%' },
    speed: { w: [.15, .10, .25, .10, .10], d: '重吞吐：能力权重降到 70%，速度分权重上调' }
  };
  var CK = ['通用知识', '科学数学', '代码Agent', '工具长文', '中文指令'];
  var FAMCOL = {
    'Qwen3.8-Flash-Next': '#49b1f5',
    'Qwen3.6-35B-A3B': '#00c4b6',
    'Tencent Hy4-Flash': '#ff7242',
    'Inkling 2 Mini': '#9b6dff'
  };
  var famShort = function (f) {
    return f.replace('Qwen3.8-Flash-Next', 'Qwen3.8-FN')
      .replace('Qwen3.6-35B-A3B', 'Qwen3.6-35B')
      .replace('Tencent Hy4-Flash', 'Hy4-Flash')
      .replace('Inkling 2 Mini', 'Inkling2M');
  };

  var PKG = {};
  DATA.forEach(function (r) {
    var k = r.fam + '||' + r.pkg;
    if (!PKG[k]) PKG[k] = { fam: r.fam, pkg: r.pkg, short: r.short, cap: r.cap, rows: [] };
    PKG[k].rows.push(r);
  });
  var MAXSPD = Math.max.apply(null, DATA.map(function (d) { return d.spd; }));
  var curW = 'bal';
  var capOf = function (r) {
    return CK.reduce(function (s, k, i) { return s + r.cap[i] * WSETS[curW].w[i]; }, 0);
  };
  var spdOf = function (r) { return r.spd / MAXSPD * 100; };
  var tsOf = function (r) { return capOf(r) * .45 + spdOf(r) * .35 + r.fit * .20; };
  var $ = function (id) { return document.getElementById(id); };

  /* ------------------------- 主题色 / Chart 基础 ------------------------- */
  function theme() {
    var cs = getComputedStyle(document.documentElement);
    var get = function (n, fb) { var v = cs.getPropertyValue(n); return (v && v.trim()) || fb; };
    return {
      text: get('--font-color', '#4c4948'),
      muted: get('--sr-muted', '#858585'),
      grid: get('--sr-grid', 'rgba(0,0,0,.08)')
    };
  }

  var charts = {};
  function kill(k) {
    if (charts[k]) { charts[k].destroy(); delete charts[k]; }
  }
  function canvas(id) { return document.getElementById(id); }
  function ready() { return typeof window.Chart !== 'undefined'; }

  function baseOptions(t) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: t.text, boxWidth: 10, font: { size: 11 } } } },
      scales: {
        x: { grid: { color: t.grid }, ticks: { color: t.muted, font: { size: 11 } } },
        y: { grid: { color: t.grid }, ticks: { color: t.muted, font: { size: 11 } } }
      }
    };
  }

  /* ------------------------------ 筛选 ------------------------------ */
  var fVram, fRam, fFam, fPlat, fGpu, fEst, wsel;
  function initControls() {
    fVram = $('srVram'); fRam = $('srRam'); fFam = $('srFam');
    fPlat = $('srPlat'); fGpu = $('srGpu'); fEst = $('srEst');
    wsel = $('srWsel');

    [fVram, fRam, fFam, fPlat, fGpu, fEst].forEach(function (el) {
      el.addEventListener('change', render);
    });
    wsel.addEventListener('change', function (e) { curW = e.target.value; render(); });
    $('srReset').addEventListener('click', function () {
      fVram.value = '12'; fRam.value = '32'; fFam.value = '';
      fPlat.value = ''; fGpu.value = '0'; fEst.checked = true;
      render();
    });
  }

  function filtered() {
    var v = +fVram.value, r = +fRam.value, f = fFam.value,
      p = fPlat.value, g = +fGpu.value, est = fEst.checked;
    return DATA.filter(function (d) {
      return (v === 0 || d.vram >= v) && (r === 0 || d.ram >= r) &&
        (!f || d.fam === f) && (!p || d.plat === p) &&
        (g === 0 || d.ngpu === g) && (est || !d.est);
    });
  }

  var sortK = 'ts', sortAsc = false;
  function sortVal(d, k) {
    if (k === 'score') return capOf(d);
    if (k === 'ts') return tsOf(d);
    if (k === 'src') return d.est ? 0 : 1;
    return d[k];
  }

  /* ------------------------------ 渲染 ------------------------------ */
  function render() {
    if (!ready()) return;
    var t = theme();
    $('srWdesc').textContent = WSETS[curW].d;

    // 填充模型族下拉（保留当前选择）
    var fams = [], seen = {};
    DATA.forEach(function (d) { if (!seen[d.fam]) { seen[d.fam] = 1; fams.push(d.fam); } });
    var cur = fFam.value;
    fFam.innerHTML = '<option value="">全部</option>' + fams.map(function (f) {
      return '<option value="' + f + '"' + (f === cur ? ' selected' : '') + '>' + f + '</option>';
    }).join('');

    var rows = filtered().slice();
    rows.sort(function (a, b) {
      var A = sortVal(a, sortK), B = sortVal(b, sortK);
      var x = (typeof A === 'number') ? A - B : String(A).localeCompare(String(B), 'zh');
      return sortAsc ? x : -x;
    });
    $('srCnt').textContent = rows.length + ' / ' + DATA.length + ' 条配置';

    mtx.tBodies[0].innerHTML = rows.map(function (d) {
      var sc = capOf(d), ts = tsOf(d);
      var fit = d.fit >= 100 ? '<span class="sr-pill ok">原生可跑</span>'
        : d.fit >= 70 ? '<span class="sr-pill warn">需手动参数</span>'
          : '<span class="sr-pill est">社区编译</span>';
      var src = d.est ? '<span class="sr-pill est">估算±20%</span>' : '<span class="sr-pill ok">实测</span>';
      var barColor = sc >= 85 ? '#00c4b6' : sc >= 75 ? '#49b1f5' : '#ff7242';
      return '<tr title="' + String(d.note).replace(/"/g, '&quot;') + '">' +
        '<td><b>' + famShort(d.fam) + '</b><span class="sr-sub">' + d.pkg + '</span></td>' +
        '<td style="font-size:12px">' + d.gpu + (d.ngpu > 1 ? '<span class="sr-tag">' + d.ngpu + '卡</span>' : '') + '</td>' +
        '<td style="font-size:12px;color:var(--sr-muted)">' + d.plat + '</td>' +
        '<td class="sr-num sr-mono">' + d.vram + '</td>' +
        '<td class="sr-num sr-mono">' + d.ram + '</td>' +
        '<td class="sr-num sr-mono" style="color:var(--sr-ok);font-weight:600">' + d.spd + '</td>' +
        '<td class="sr-num sr-mono">' + d.pre.toLocaleString() + '</td>' +
        '<td class="sr-num"><span class="sr-bar"><i style="width:' + sc + '%;background:' + barColor + '"></i></span><span class="sr-mono">' + sc.toFixed(1) + '</span></td>' +
        '<td class="sr-num sr-mono" style="font-weight:600">' + ts.toFixed(1) + '</td>' +
        '<td>' + fit + '</td>' +
        '<td>' + src + '</td></tr>';
    }).join('') || '<tr><td colspan="11" style="text-align:center;color:var(--sr-muted);padding:26px">当前筛选下没有可部署的配置 —— 试着放宽内存或显存</td></tr>';

    Array.prototype.forEach.call(mtx.querySelectorAll('thead th'), function (th) {
      th.onclick = function () {
        var k = th.dataset.k;
        if (!k) return;
        sortAsc = (sortK === k) ? !sortAsc : false;
        sortK = k;
        render();
      };
    });

    drawRank(t);
    drawRadar(t);
    drawScatter(rows, t);
    drawQuant(rows, t);
    drawRam(t);
    drawMulti(t);
  }

  /* ------------------------------ 图表 ------------------------------ */
  function pkgList() {
    var f = filtered(), seen = {}, out = [];
    f.forEach(function (d) {
      var k = d.fam + '||' + d.pkg;
      if (!seen[k] || d.spd > seen[k].spd) seen[k] = d;
    });
    Object.keys(seen).forEach(function (k) { out.push(seen[k]); });
    return out.sort(function (a, b) { return capOf(b) - capOf(a); });
  }

  var locked = [];
  function drawRank(t) {
    kill('rank');
    var L = pkgList().slice(0, 14);
    var lb = L.map(function (d) { return famShort(d.fam) + ' · ' + d.short; });
    var sc = L.map(function (d) { return +capOf(d).toFixed(1); });
    charts.rank = new Chart(canvas('srRank'), {
      type: 'bar',
      data: {
        labels: lb,
        datasets: [{
          data: sc,
          backgroundColor: L.map(function (d) {
            return locked.indexOf(d.fam + '||' + d.pkg) > -1 ? FAMCOL[d.fam] : FAMCOL[d.fam] + '99';
          }),
          borderColor: L.map(function (d) {
            return locked.indexOf(d.fam + '||' + d.pkg) > -1 ? t.text : FAMCOL[d.fam];
          }),
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) {
                var d = L[c.dataIndex];
                return ['能力 ' + sc[c.dataIndex], '最快 ' + d.spd + ' tok/s @ ' + d.gpu, d.note];
              }
            }
          }
        },
        scales: {
          x: { min: 0, max: 100, grid: { color: t.grid }, ticks: { color: t.muted, font: { size: 11 } } },
          y: { grid: { display: false }, ticks: { color: t.muted, font: { size: 10.5 } } }
        },
        onClick: function (e, a) {
          if (!a.length) return;
          var k = L[a[0].index].fam + '||' + L[a[0].index].pkg;
          if (locked.indexOf(k) > -1) locked = locked.filter(function (x) { return x !== k; });
          else if (locked.length >= 4) locked = [k];
          else locked.push(k);
          drawRank(theme());
          drawRadar(theme());
        }
      }
    });
  }

  function drawRadar(t) {
    kill('radar');
    var sel = locked.length ? locked.slice(0, 4)
      : pkgList().slice(0, 3).map(function (d) { return d.fam + '||' + d.pkg; });
    var ds = sel.map(function (k) {
      var p = PKG[k];
      if (!p) return null;
      return {
        label: famShort(p.fam) + ' ' + p.short,
        data: CK.map(function (c, i) { return p.cap[i]; }),
        borderColor: FAMCOL[p.fam],
        backgroundColor: FAMCOL[p.fam] + '22',
        pointBackgroundColor: FAMCOL[p.fam],
        borderWidth: 2
      };
    }).filter(Boolean);
    charts.radar = new Chart(canvas('srRadar'), {
      type: 'radar',
      data: { labels: CK, datasets: ds },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0, max: 100,
            grid: { color: t.grid }, angleLines: { color: t.grid },
            pointLabels: { color: t.text, font: { size: 11 } },
            ticks: { display: false, stepSize: 25 }
          }
        },
        plugins: { legend: { labels: { color: t.text, boxWidth: 10, font: { size: 11 } } } }
      }
    });
  }

  function drawScatter(rows, t) {
    kill('scat');
    var fams = [];
    rows.forEach(function (d) { if (fams.indexOf(d.fam) < 0) fams.push(d.fam); });
    charts.scat = new Chart(canvas('srScatter'), {
      type: 'bubble',
      data: {
        datasets: fams.map(function (f) {
          return {
            label: famShort(f),
            data: rows.filter(function (d) { return d.fam === f; }).map(function (d) {
              return { x: d.spd, y: +capOf(d).toFixed(1), r: Math.max(4, Math.sqrt(d.vram) * 2.6), raw: d };
            }),
            backgroundColor: FAMCOL[f] + '99',
            borderColor: FAMCOL[f],
            borderWidth: 1
          };
        })
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: t.text, boxWidth: 9, font: { size: 11 } } },
          tooltip: {
            callbacks: {
              label: function (c) {
                var d = c.raw.raw;
                return [famShort(d.fam) + ' ' + d.short, d.spd + ' tok/s · 能力 ' + c.raw.y.toFixed(1), d.gpu, d.note];
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: '解码速度 tok/s', color: t.muted, font: { size: 11 } },
            grid: { color: t.grid }, ticks: { color: t.muted, font: { size: 11 } }
          },
          y: {
            title: { display: true, text: '能力分', color: t.muted, font: { size: 11 } },
            grid: { color: t.grid }, ticks: { color: t.muted, font: { size: 11 } }, min: 40, max: 100
          }
        }
      }
    });
  }

  function drawQuant(rows, t) {
    kill('quant');
    var vram = +fVram.value || 12;
    var lo = vram >= 24 ? 24 : vram, hi = vram >= 24 ? 999 : vram + 4;
    var same = rows.filter(function (d) { return d.vram >= lo && d.vram < hi; })
      .sort(function (a, b) { return b.spd - a.spd; }).slice(0, 9);
    charts.quant = new Chart(canvas('srQuant'), {
      type: 'bar',
      data: {
        labels: same.map(function (d) { return famShort(d.fam) + ' ' + d.short; }),
        datasets: [{
          label: '解码 tok/s',
          data: same.map(function (d) { return d.spd; }),
          backgroundColor: same.map(function (d) { return FAMCOL[d.fam] + 'bb'; }),
          borderColor: same.map(function (d) { return FAMCOL[d.fam]; }),
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { afterLabel: function (c) { return same[c.dataIndex].gpu; } } }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: t.muted, font: { size: 10 }, maxRotation: 38, minRotation: 38 }
          },
          y: { grid: { color: t.grid }, ticks: { color: t.muted, font: { size: 11 } }, beginAtZero: true }
        }
      }
    });
  }

  function drawRam(t) {
    kill('ram');
    var L = [{ r: '192 GB', v: 41 }, { r: '128 GB', v: 34 }, { r: '96 GB', v: 29.3 }, { r: '64 GB', v: 21 }];
    charts.ram = new Chart(canvas('srRamLine'), {
      type: 'line',
      data: {
        labels: L.map(function (x) { return x.r; }),
        datasets: [{
          label: '单 3090 24G · 125B tok/s',
          data: L.map(function (x) { return x.v; }),
          borderColor: '#ff7242',
          backgroundColor: 'rgba(255,114,66,.15)',
          fill: true, tension: .3, pointRadius: 4, pointBackgroundColor: '#ff7242'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: t.text, boxWidth: 10, font: { size: 11 } } },
          tooltip: {
            callbacks: {
              afterLabel: function () { return ['同显卡、同模型，只换内存', '192GB→41，64GB→21：差近一倍']; }
            }
          }
        },
        scales: {
          x: {
            grid: { color: t.grid }, ticks: { color: t.muted, font: { size: 11 } },
            title: { display: true, text: '系统内存（单卡 24G 不变）', color: t.muted, font: { size: 11 } }
          },
          y: {
            grid: { color: t.grid }, ticks: { color: t.muted, font: { size: 11 } }, beginAtZero: true,
            title: { display: true, text: 'tok/s', color: t.muted, font: { size: 11 } }
          }
        }
      }
    });
  }

  function drawMulti(t) {
    kill('multi');
    var L = [
      { k: '1× RTX 5090 32G', a: 197, b: 0 },
      { k: '4× RTX 4090 24G', a: 152, b: 508 },
      { k: '4× RTX 5090 32G', a: 274, b: 1132 },
      { k: '2× RTX 3090 24G (Coder)', a: 103, b: 0 },
      { k: '3× Tesla V100 32G', a: 374, b: 0 },
      { k: '4× R9700 (Hy4)', a: 80, b: 0 }
    ];
    charts.multi = new Chart(canvas('srMulti'), {
      type: 'bar',
      data: {
        labels: L.map(function (x) { return x.k; }),
        datasets: [
          {
            label: '单流解码',
            data: L.map(function (x) { return x.a; }),
            backgroundColor: 'rgba(73,177,245,.72)',
            borderColor: '#49b1f5', borderWidth: 1, borderRadius: 4
          },
          {
            label: '8-16 并发聚合',
            data: L.map(function (x) { return x.b || null; }),
            backgroundColor: 'rgba(0,196,182,.72)',
            borderColor: '#00c4b6', borderWidth: 1, borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: t.text, boxWidth: 10, font: { size: 11 } } },
          tooltip: {
            callbacks: {
              afterLabel: function (c) {
                return c.datasetIndex === 0
                  ? ['层切分流水线，非张量并行', '双 3090：66.8→98.6，仅 1.48×']
                  : ['并发槽 × 流水组调优后', '4090 8 并发 507.8 / 5090 16 并发 1132'];
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: t.muted, font: { size: 10 }, maxRotation: 30, minRotation: 30 }
          },
          y: {
            grid: { color: t.grid }, ticks: { color: t.muted, font: { size: 11 } }, beginAtZero: true,
            title: { display: true, text: 'tok/s', color: t.muted, font: { size: 11 } }
          }
        }
      }
    });
  }

  /* ------------------------------ 启动 ------------------------------ */
  if (!ready()) {
    Array.prototype.forEach.call(document.querySelectorAll('.sr-cw'), function (box) {
      box.innerHTML = '<div style="padding:20px;color:var(--sr-no);font-size:13px">图表库未能载入</div>';
    });
    initControls();
    return;
  }

  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  initControls();
  render();

  // 明暗模式切换后重算颜色
  var lastTheme = document.documentElement.getAttribute('data-theme');
  new MutationObserver(function () {
    var now = document.documentElement.getAttribute('data-theme');
    if (now === lastTheme) return;
    lastTheme = now;
    render();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();
