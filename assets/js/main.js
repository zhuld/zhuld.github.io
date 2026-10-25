// 移动端汉堡菜单
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('#nav-menu');
        
        function closeMenu() {
            navMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', '打开菜单');
        }
        
        navToggle.addEventListener('click', function () {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            navToggle.setAttribute('aria-label', isOpen ? '关闭菜单' : '打开菜单');
        });
        
        // 平滑滚动效果 + 点击链接后收起菜单
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                closeMenu();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // 点击菜单区域以外时收起菜单
        document.addEventListener('click', function (e) {
            if (navMenu.classList.contains('open') && !e.target.closest('header')) {
                closeMenu();
            }
        });
        
        // 窗口切换回桌面宽度时重置菜单状态
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });