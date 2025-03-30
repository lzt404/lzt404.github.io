# vscode配置c/c++环境借助gdb可视化调试(json文件到底怎么设置)

​	vscode是一个界面很优美，轻量化的编辑器,同时拥有强大的插件生态，几乎可以适用于任何编程语言的开发。本文是c/c++开发环境的搭建教程，主要内容是介绍一下tasks.json 文件和 launch.json文件怎么写。

​	开始之前请记住一件事:

> vscode 本质就是一个简易浏览器，任何nodejs项目都能融进去	--锦恢



## 安装c编译器

​	首先需要在电脑中安装一款gcc编译器，并将其添加在环境变量里。

​	**Windows环境：**

​		我使用的是MinGW的C编译器，这个如何完成请自行百度。同时记得添加环境变量路径之后重启一下电脑，当能在命令行终端输入 gcc -v看到版本信息即代表配置成功。

​	**Linux环境：**

​		Linux环境下就方便很多了，这里默认大家使用的都是Debian系的Linux发行版，输入如下指令即可:

```bash
sudo apt install gcc
```

​		还可以用如下指令看看被安装在哪了:

```bash
which gcc
```



## 体验命令行编译程序

​	在某个文件夹下新建个c文件，随便写点代码：

```c
#include <stdio.h>

int main() {
    printf("hello gcc\n");
    return 0;
}
```

​	在命令行终端使用指令编译

```c
gcc *.c -o a.exe
```

​	*.c代指C文件的名字

​	执行之后没有任何提示即表示编译成功，可通过如下指令运行刚刚编译的程序

```bash
.\a.exe
```

​	

## 安装必要的插件

### C/C++插件:	

​	为了更好的使用,我们需要安装vscode的插件 ，这个插件是用于语法检测代码补全的。



### Tasks插件：

​	这个插件是用于给自己写的任务提供一个方便的启动按钮



## 编写配置文件

​	在工作区新建一个.vscode文件夹

### tasks.json文件的编写

​	在.vscode文件夹新建一个tasks.json文件

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "编译C文件",
            "type": "shell",				//任务类型
            "command": "gcc 1.c  -g -O0 -o 1.exe",  //编译指令,相当于你在命令行执行的指令
            "args": [],						//可以直接在command把参数弄好,这个不很有必要
            "group": "build",				//这个主要是告诉vscode这个任务的类型
            "options": {
                "cwd": "${workspaceFolder}" //表示command的指令的运行目录,${workspaceFolder}是vscode的变量,表示工作区目录
            },
            "detail": "Run make to build the project"  //类似于描述吧,可以不填
        },
        {
            "label": "编译C++文件",
            "type": "shell",				//任务类型
            "command": "g++ 2.cpp -g -O0 -o 2.exe",  //编译指令,相当于你在命令行执行的指令
            "args": [],						//可以直接在command把参数弄好,这个不很有必要
            "group": "build",				//这个主要是告诉vscode这个任务的类型
            "options": {
                "cwd": "${workspaceFolder}" //表示command的指令的运行目录,${workspaceFolder}是vscode的变量,表示工作区目录
            },
            "detail": "Run make to build the project"  //类似于描述吧,可以不填
        }
    ]
}
```

​	保存之后就会发现状态栏下方出现了个"编译C文件"的选项,点击一下就会运行 "gcc 1.c -o 1.exe",这样子就能编译成功了.

### launch.json文件的编写

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "调试c文件",    
            "type": "cppdbg",                       // 默认这个就好
            "request": "launch",                    // 默认这个就好
            "program": "${workspaceFolder}/1.exe",  // 编译出来的文件的路径,得包含文件名
            "args": [                               // 程序运行时的命令行参数。
                ""
            ],
            "stopAtEntry": true,                    // 是否在程序入口处暂停调试。不严谨的讲就是是否在main函数处暂停。
            "cwd": "${workspaceFolder}",            // 调试时程序运行的目录
            "environment": [],                      // 环境变量设置，一般默认为空就好
            "externalConsole": false,               // 一般不打开外部控制台
            "MIMode": "gdb",                        // 调试器模式，"gdb" 表示使用 GNU 调试器。
            "preLaunchTask": "编译C文件",            // 调试前需要执行的任务名称.那当然是先编译啦.
        },
        {
            "name": "调试c++文件",
            "request": "launch",
            "type": "cppdbg",
            "program": "${workspaceFolder}/2.exe",
            "args": [
                ""
            ],
            "stopAtEntry": true,
            "cwd": "${workspaceFolder}",
            "environment": [],
            "externalConsole": false,
            "MIMode": "gdb",
            "preLaunchTask": "编译C++文件",
        }
    ]
}
```

## 最终效果演示	

​	此时点击左侧有虫子的图标,就可以选择要执行的调试选项了。这时候就可以在代码行前自由设置断点，在watch栏添加要查看的变量或者内存信息，同时也支持寄存器值的查看，如果还需要别的，可以在debug console处自由输入gdb指令进行。

![](https://picx.zhimg.com/80/v2-58fbc8cecd9b17f4b3fa27fc3a4cc5a4_1440w.jpg)

![2](https://picx.zhimg.com/80/v2-f04d50156ead4850fe1f7f9d04665ecc_1440w.jpg)