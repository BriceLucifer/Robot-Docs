# windows 版本安装

## **B. Install LeRobot**

### 1. 安装 Miniconda
参考 [Miniconda 安装指南](https://docs.anaconda.com/miniconda/install/#quick-command-line-install)。

### 2. 重启 Shell
运行以下命令：
```powershell
. $PROFILE
```

### 3. 创建并激活新的 Conda 环境
```powershell
conda create -y -n lerobot python=3.10
conda activate lerobot
```

### 4. 克隆 LeRobot 仓库
```powershell
git clone https://github.com/huggingface/lerobot.git $HOME\lerobot
```

### 5. 安装 LeRobot 及其依赖
```powershell
cd $HOME\lerobot
pip install -e ".[feetech]"
```

---

## **C. Configure the motors**

### 1. 查找 USB 端口
```powershell
python lerobot/scripts/find_motors_bus_port.py
```

### 2. 设置电机 ID
```powershell
python lerobot/scripts/configure_motor.py --port /dev/tty.usbmodem58760432961 --brand feetech --model sts3215 --baudrate 1000000 --ID 1
```

---

## **E. Calibrate**

### 1. 校准跟随臂
```powershell
python lerobot/scripts/control_robot.py --robot.type=so100 --robot.cameras='{}' --control.type=calibrate --control.arms='["main_follower"]'
```

### 2. 校准领导臂
```powershell
python lerobot/scripts/control_robot.py --robot.type=so100 --robot.cameras='{}' --control.type=calibrate --control.arms='["main_leader"]'
```

---

## **F. Teleoperate**

### 1. 简单遥操作
```powershell
python lerobot/scripts/control_robot.py --robot.type=so100 --robot.cameras='{}' --control.type=teleoperate
```

### 2. 带摄像头的遥操作
```powershell
python lerobot/scripts/control_robot.py --robot.type=so100 --control.type=teleoperate
```

---

## **G. Record a dataset**

### 1. 登录 Hugging Face
```powershell
$env:HUGGINGFACE_TOKEN = "your_token_here"
huggingface-cli login --token $env:HUGGINGFACE_TOKEN --add-to-git-credential
```

### 2. 记录数据集
```powershell
$HF_USER = (huggingface-cli whoami | Select-Object -First 1)
python lerobot/scripts/control_robot.py --robot.type=so100 --control.type=record --control.fps=30 --control.single_task="Grasp a lego block and put it in the bin." --control.repo_id=$HF_USER/so100_test --control.tags='["so100","tutorial"]' --control.warmup_time_s=5 --control.episode_time_s=30 --control.reset_time_s=30 --control.num_episodes=2 --control.push_to_hub=true
```

---

## **H. Visualize a dataset**

### 1. 在线可视化
```powershell
echo $HF_USER/so100_test
```

### 2. 本地可视化
```powershell
python lerobot/scripts/visualize_dataset_html.py --repo-id $HF_USER/so100_test --local-files-only 1
```

---

## **I. Replay an episode**

```powershell
python lerobot/scripts/control_robot.py --robot.type=so100 --control.type=replay --control.fps=30 --control.repo_id=$HF_USER/so100_test --control.episode=0
```

---

## **J. Train a policy**

```powershell
python lerobot/scripts/train.py --dataset.repo_id=$HF_USER/so100_test --policy.type=act --output_dir=outputs/train/act_so100_test --job_name=act_so100_test --device=cuda --wandb.enable=true
```

---

## **K. Evaluate your policy**

```powershell
python lerobot/scripts/control_robot.py --robot.type=so100 --control.type=record --control.fps=30 --control.single_task="Grasp a lego block and put it in the bin." --control.repo_id=$HF_USER/eval_act_so100_test --control.tags='["tutorial"]' --control.warmup_time_s=5 --control.episode_time_s=30 --control.reset_time_s=30 --control.num_episodes=10 --control.push_to_hub=true --control.policy.path=outputs/train/act_so100_test/checkpoints/last/pretrained_model
```

---

## **L. More Information**

参考 [LeRobot 官方教程](https://github.com/huggingface/lerobot/blob/main/examples/7_get_started_with_real_robot.md#4-train-a-policy-on-your-data)。

---

## 注意事项
1. 在 PowerShell 中，`$HOME` 代替了 `~`。
2. 环境变量使用 `$env:VAR_NAME` 语法。
3. 如果遇到权限问题，可能需要以管理员身份运行 PowerShell。