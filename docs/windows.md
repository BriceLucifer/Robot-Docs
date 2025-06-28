# Windows 环境下的 SO-100 机械臂配置指南

本指南专门针对 Windows 用户安装和配置 LeRobot 环境，适用于 SO-100 机械臂。

## 系统要求

- Windows 10 或更高版本
- PowerShell 7.0 或更高版本
- 至少 8GB 可用磁盘空间
- Visual Studio（用于 MSVC 编译器）

## 环境准备

### 1. 安装 Git

下载并安装 [Git for Windows](https://git-scm.com/downloads/win)，选择适合你系统架构的版本。

### 2. 安装 PowerShell 7

下载并安装 [PowerShell 7](https://github.com/powershell/powershell/releases)

> [!TIP]
> PowerShell 7 功能强大且易用，选择适合自己的架构。配合 Windows Terminal 使用体验更佳，与 Python 和 VSCode 结合使用效果极佳。

### 3. 安装 Scoop 包管理器

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```
### 安装visual studio 
[Visual Studio](https://visualstudio.microsoft.com/zh-hans/thank-you-downloading-visual-studio/?sku=Community&channel=Release&version=VS2022&source=VSLandingPage&cid=2030&passive=false)
> windows环境下需要他微软自己家的c/c++编译器也就是msvc编译器，而不是mingw，所以需要安装visual studio。

### 1. 安装uv
```powershell
scoop bucket add main
scoop install main/curl
scoop install main/uv
```
### 2. 安装ffmpeg
```powershell
scoop install main/ffmpeg
```

### 3. 克隆 LeRobot 仓库
```powershell
git clone https://github.com/BriceLucifer/Robot-Docs.git
cd Robot-Docs
cd lerobot # 我自己设置了一个lerobot仓库 旧版的 适合所有人去用
```

### 4. 安装 LeRobot 及其依赖
```powershell
uv sync # 自动同步项目环境
./.venv/Scripts/activate.bat # 激活环境
uv pip install -e ".[feetech]"
```

---

## C. 配置电机

### 1. 查找与每个机械臂关联的 USB 端口

为你的领导臂指定一个总线伺服适配器和 6 个电机，同样为跟随臂指定另一个总线伺服适配器和 6 个电机。建议给它们贴标签，在每个电机上写明它是用于跟随臂 `F` 还是领导臂 `L`，以及它的 ID 从 1 到 6（F1...F6 和 L1...L6）。

#### a. 运行脚本查找端口

要找到每个总线伺服适配器的端口，运行实用脚本：
```powershell
python lerobot/scripts/find_motors_bus_port.py
```

#### b. 示例输出

识别领导臂端口时的示例输出（例如，Windows 上的 `COM3`，或 `COM4`）：
```
Finding all available ports for the MotorBus.
['COM3', 'COM4']
Remove the usb cable from your MotorsBus and press Enter when done.

[...断开领导臂连接并按 Enter...]

The port of this MotorsBus is COM3
Reconnect the usb cable.
```

#### c. 故障排除
在 Windows 上，确保设备管理器中正确识别了 USB 串口设备。

### 2. 为所有 12 个电机设置 ID

插入你的第一个电机 F1 并运行此脚本将其 ID 设置为 1。它还会将其当前位置设置为 2048，所以预期你的电机会旋转。将 --port 后的文本替换为相应的跟随控制板端口，并在 PowerShell 中运行此命令：
```powershell
python lerobot/scripts/configure_motor.py `
  --port COM3 `
  --brand feetech `
  --model sts3215 `
  --baudrate 1000000 `
  --ID 1
```

然后拔掉你的电机，插入第二个电机并将其 ID 设置为 2：
```powershell
python lerobot/scripts/configure_motor.py `
  --port COM3 `
  --brand feetech `
  --model sts3215 `
  --baudrate 1000000 `
  --ID 2
```

对所有电机重复此过程直到 ID 6。对领导臂的 6 个电机也做同样的操作。

---

## E. 校准

接下来，你需要校准你的 SO-100 机器人，以确保领导臂和跟随臂在相同物理位置时具有相同的位置值。

### 1. 校准跟随臂

确保两个机械臂都已连接，运行此脚本启动手动校准：
```powershell
python lerobot/scripts/control_robot.py `
  --robot.type=so100 `
  --robot.cameras='{}' `
  --control.type=calibrate `
  --control.arms='["main_follower"]'
```

### 2. 校准领导臂

运行此脚本启动手动校准：
```powershell
python lerobot/scripts/control_robot.py `
  --robot.type=so100 `
  --robot.cameras='{}' `
  --control.type=calibrate `
  --control.arms='["main_leader"]'
```

---

## F. 遥操作

### 1. 简单遥操作

运行这个简单的脚本（它不会连接和显示摄像头）：
```powershell
python lerobot/scripts/control_robot.py `
  --robot.type=so100 `
  --robot.cameras='{}' `
  --control.type=teleoperate
```

### 2. 带摄像头的遥操作

按照指南设置你的摄像头后，你将能够在遥操作时在计算机上显示摄像头：
```powershell
python lerobot/scripts/control_robot.py `
  --robot.type=so100 `
  --control.type=teleoperate
```

---

## G. 记录数据集

### 1. 登录 Hugging Face

如果你想使用 Hugging Face hub 功能上传数据集，请确保你已经使用写访问令牌登录：
```powershell
$env:HUGGINGFACE_TOKEN = "your_token_here"
huggingface-cli login --token $env:HUGGINGFACE_TOKEN --add-to-git-credential
```

### 2. 设置用户变量并记录数据集

将你的 Hugging Face 仓库名称存储在变量中：
```powershell
$HF_USER = (huggingface-cli whoami | Select-Object -First 1)
Write-Output $HF_USER
```

记录 2 个片段并将数据集上传到 hub：
```powershell
python lerobot/scripts/control_robot.py `
  --robot.type=so100 `
  --control.type=record `
  --control.fps=30 `
  --control.single_task="Grasp a lego block and put it in the bin." `
  --control.repo_id="$HF_USER/so100_test" `
  --control.tags='["so100","tutorial"]' `
  --control.warmup_time_s=5 `
  --control.episode_time_s=30 `
  --control.reset_time_s=30 `
  --control.num_episodes=2 `
  --control.push_to_hub=true
```

> [!NOTE]
> 你可以通过添加 `--control.resume=true` 来恢复记录。

---

## H. 可视化数据集

### 1. 在线可视化

如果你使用 `--control.push_to_hub=true` 将数据集上传到 hub，你可以通过复制粘贴你的仓库 id 来在线可视化你的数据集：
```powershell
Write-Output "$HF_USER/so100_test"
```

### 2. 本地可视化

如果你没有上传，你也可以本地可视化（可以在浏览器 `http://127.0.0.1:9090` 中打开一个窗口使用可视化工具）：
```powershell
python lerobot/scripts/visualize_dataset_html.py `
  --repo-id "$HF_USER/so100_test" `
  --local-files-only 1
```

---

## I. 重放片段

现在尝试在你的机器人上重放第一个片段：
```powershell
python lerobot/scripts/control_robot.py `
  --robot.type=so100 `
  --control.type=replay `
  --control.fps=30 `
  --control.repo_id="$HF_USER/so100_test" `
  --control.episode=0
```

---

## J. 训练策略

要训练控制机器人的策略，使用训练脚本。这里是一个示例命令：
```powershell
python lerobot/scripts/train.py `
  --dataset.repo_id="$HF_USER/so100_test" `
  --policy.type=act `
  --output_dir=outputs/train/act_so100_test `
  --job_name=act_so100_test `
  --policy.device=cuda `
  --wandb.enable=true
```

### 从检查点恢复训练

要从检查点恢复训练，下面是从 `act_so100_test` 策略的 `last` 检查点恢复的示例命令：
```powershell
python lerobot/scripts/train.py `
  --config_path=outputs/train/act_so100_test/checkpoints/last/pretrained_model/train_config.json `
  --resume=true
```

---

## K. 评估策略

你可以使用控制脚本的 `record` 功能，但以策略检查点作为输入。例如，运行此命令记录 10 个评估片段：
```powershell
python lerobot/scripts/control_robot.py `
  --robot.type=so100 `
  --control.type=record `
  --control.fps=30 `
  --control.single_task="Grasp a lego block and put it in the bin." `
  --control.repo_id="$HF_USER/eval_act_so100_test" `
  --control.tags='["tutorial"]' `
  --control.warmup_time_s=5 `
  --control.episode_time_s=30 `
  --control.reset_time_s=30 `
  --control.num_episodes=10 `
  --control.push_to_hub=true `
  --control.policy.path=outputs/train/act_so100_test/checkpoints/last/pretrained_model
```

---

---

## 注意事项

1. 在 PowerShell 中，使用反引号 `` ` `` 进行命令行续行。
2. 环境变量使用 `$env:VAR_NAME` 语法。
3. 字符串变量使用 `$VARIABLE_NAME` 语法。
4. Windows 上的串口通常是 `COM1`, `COM2` 等格式。
5. 如果遇到权限问题，可能需要以管理员身份运行 PowerShell。
6. 使用 `Write-Output` 代替 `echo` 命令。
7. 确保在字符串中正确转义双引号。
```