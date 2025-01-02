# Setup
[[toc]]

Linux(ubuntu)
在linux我比较推荐ubuntu，因为这可能是对于初学者入门最友好的linux操作系统，对比arch和一系列的发行版，相对来说比较稳定，那么我接下来说一下需要的组件和安装包,比较推荐22.04，相对来说不会有啥问题，包管理器还是比较稳定。

## 配置镜像源(这里比较推荐清华镜像源)
1. 网址：[清华镜像源](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/)
2. 开始配置
```shell
# 跳转到/etc/apt/sources.list
cd /etc/apt/

# 一定要加权限 不然无法修改 此处用了vim
sudo vim /etc/apt/sources.list
```
粘贴以下内容：
```shell
# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble-updates main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble-backports main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble-backports main restricted universe multiverse

# 以下安全更新软件源包含了官方源与镜像站配置，如有需要可自行修改注释切换
deb http://security.ubuntu.com/ubuntu/ noble-security main restricted universe multiverse
# deb-src http://security.ubuntu.com/ubuntu/ noble-security main restricted universe multiverse

# 预发布软件源，不建议启用
# deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble-proposed main restricted universe multiverse
# # deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble-proposed main restricted universe multiverse
```
> [!TIP]
> 此处vim操作是：
> gg 然后 dG (gg是跳转到最后一样，dG是删除到第一行)
然后保存退出，退出后在终端输入：
```shell
sudo apt update
```

## 安装需要的组件
1. 基础组件
```shell
sudo apt install build-essential fish python3 llvm clang clangd curl gnupg2 lsb-release
```
>[!TIP]
>如果需要安装ros2 请参考[这篇文章](https://dev.ros2.fishros.com/doc/Installation/Ubuntu-Install-Binary.html) 我不再赘述

2. 安装miniconda
- 由于国内网络受限，使用本网站[清华源配置](https://mirrors.tuna.tsinghua.edu.cn/anaconda/miniconda/) 下载需要的脚本 然后运行shell 脚本
- 安装完成后输入
```shell
conda -V
python3 -V
# 都可以输出内容即可
```

## 配置国内镜像源(清华):
### miniconda
```shell
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge 
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/msys2/
conda config --set show_channel_urls yes
```
如果要恢复到默认源，可以执行以下命令
```shell
conda config --remove-key channels
```
conda 安装三方库的命令如下，这里以numpy库为例
```shell
conda install numpy -y
安装完成后执行如下命令，查看是否安装成功

conda list
```

### pip设置国内源
以清华源为例，执行以下命令即可
```shell
pip3 install pip -U
python -m ensurepip 
python -m pip install --upgrade pip
pip3 config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```
