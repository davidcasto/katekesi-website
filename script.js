
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');
    const courseDetailsDiv = document.getElementById('courseDetails');
    const courseDetailsContentDiv = document.getElementById('courseDetailsContent');
    const courseListDropdown = document.querySelector('.dropdown-content');
    let currentLanguage = 'sw';

    // ===== MOBILE MENU TOGGLE =====
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            if (navLinks) navLinks.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }

    // ===== CLOSE MENU ON OUTSIDE CLICK =====
    document.addEventListener('click', function (e) {
        if (!e.target.closest('header')) {
            if (navLinks) navLinks.classList.remove('active');
            if (nav) nav.classList.remove('active');
            if (menuToggle) {
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // ===== DROPDOWN TOGGLE (Mobile only) =====
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (link) {
            link.addEventListener('click', function (e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    

    // ===== SMOOTH SCROLLING FOR NAV LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                if (navLinks) navLinks.classList.remove('active');
                if (nav) nav.classList.remove('active');
                if (menuToggle) {
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // ===== POPULATE COURSE LIST ITEMS FROM DATA =====
    if (courseListDropdown && typeof coursesData !== 'undefined') {
        courseListDropdown.innerHTML = '';
        Object.keys(coursesData).forEach(courseId => {
            const li = document.createElement('li');
            li.dataset.course = courseId;
            li.textContent = coursesData[courseId][`title_${currentLanguage}`] || coursesData[courseId].title_sw;
            courseListDropdown.appendChild(li);
        });
    }

    // ===== COURSE DETAILS FUNCTIONALITY =====
    if (courseListDropdown && courseDetailsDiv && courseDetailsContentDiv) {
        courseListDropdown.addEventListener('click', function (event) {
            if (event.target.tagName === 'LI') {
                const courseId = event.target.dataset.course;
                displayCourseDetails(courseId, currentLanguage);

                if (navLinks) navLinks.classList.remove('active');
                if (nav) nav.classList.remove('active');
                if (menuToggle) {
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    function displayCourseDetails(courseId, lang) {
        if (!coursesData || !coursesData[courseId]) {
            if (courseDetailsContentDiv) {
                courseDetailsContentDiv.innerHTML = `<p>Taarifa za kozi hazikupatikana.</p>`;
                if (courseDetailsDiv) courseDetailsDiv.classList.remove('hidden');
            }
            return;
        }

        const course = coursesData[courseId];
        let detailsHTML = `
            <h3>${course[`title_${lang}`] || course.title_sw || ''}</h3>
            <p class="course-description">${course[`description_${lang}`] || course.description_sw || ''}</p>
            <p><strong>Lengo la Walengwa:</strong> ${course[`targetAudience_${lang}`] || course.targetAudience_sw || ''}</p>
        `;

        const objectives = course[`learningObjectives_${lang}`] || course.learningObjectives_sw || [];
        if (objectives.length > 0) {
            detailsHTML += `<h4>Malengo ya Kujifunza:</h4><ul>`;
            objectives.forEach(obj => {
                detailsHTML += `<li>${obj}</li>`;
            });
            detailsHTML += `</ul>`;
        }

        const modules = course[`modules_${lang}`] || course.modules_sw || [];
        if (modules.length > 0) {
            detailsHTML += `<h4>Yaliyomo/Moduli za Kozi:</h4><ul>`;
            modules.forEach(mod => {
                detailsHTML += `<li><strong>${mod.title}:</strong> ${mod.content}</li>`;
            });
            detailsHTML += `</ul>`;
        }

        const metadata = [
            { key: 'Muda/Ratiba', value: course[`duration_${lang}`] || course.duration_sw },
            { key: 'Mahitaji ya Awali', value: course[`prerequisites_${lang}`] || course.prerequisites_sw },
            { key: 'Mwalimu(wa)', value: course[`instructors_${lang}`] || course.instructors_sw },
            { key: 'Taarifa za Usajili', value: course[`registrationInfo_${lang}`] || course.registrationInfo_sw },
            { key: 'Vifaa', value: course[`materials_${lang}`] || course.materials_sw }
        ];

        metadata.forEach(item => {
            if (item.value) {
                detailsHTML += `<p><strong>${item.key}:</strong> ${item.value}</p>`;
            }
        });

        if (courseDetailsContentDiv) {
            courseDetailsContentDiv.innerHTML = detailsHTML;
        }
        if (courseDetailsDiv) {
            courseDetailsDiv.classList.remove('hidden');
            courseDetailsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    
    // ===== UPDATE COURSE LIST LANGUAGE =====
    function updateCourseListLanguage(lang) {
        const courseList = document.querySelectorAll('.dropdown-content li');
        courseList.forEach(li => {
            const courseId = li.dataset.course;
            if (coursesData[courseId]) {
                li.textContent = coursesData[courseId][`title_${lang}`] || coursesData[courseId].title_sw || li.textContent;
            }
        });
    }

    // ===== LANGUAGE TOGGLE BUTTON EVENT =====
    const langToggleBtn = document.getElementById('langToggle');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', function () {
            currentLanguage = (currentLanguage === 'sw') ? 'en' : 'sw';
            updateCourseListLanguage(currentLanguage);
            const currentOpenCourse = courseDetailsContentDiv?.querySelector('h3');
            if (currentOpenCourse) {
                const courseId = Object.keys(coursesData).find(id => 
                    coursesData[id].title_sw === currentOpenCourse.textContent || 
                    coursesData[id].title_en === currentOpenCourse.textContent
                );
                if (courseId) {
                    displayCourseDetails(courseId, currentLanguage);
                }
            }
        });
    }
});
