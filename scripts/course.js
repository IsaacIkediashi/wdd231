
const courses = [
    {
        subject: "CSE",
        number: 110,
        title: "Introduction to Programming",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 130,
        title: "Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "CSE",
        number: 111,
        title: "Programming with Functions",
        credits: 2,
        completed: true
    },
    {
        subject: "CSE",
        number: 210,
        title: "Programming with Classes",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 131,
        title: "Dynamic Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 231,
        title: "Web Frontend Development I",
        credits: 2,
        completed: false
    }
];

const courseContainer = document.querySelector("#course-container");
const courseCount = document.querySelector("#course-count");
const creditTotal = document.querySelector("#credit-total");
const filterButtons = document.querySelectorAll(".filter-button");

function displayCourses(courseList) {
    if (!courseContainer || !courseCount || !creditTotal) {
        return;
    }

    courseContainer.innerHTML = "";

    if (courseList.length === 0) {
        courseContainer.innerHTML =
            '<p class="empty-message">No courses found.</p>';
    }

    courseList.forEach((course) => {
        const card = document.createElement("article");

        card.classList.add("course-card");

        if (course.completed) {
            card.classList.add("completed");
        }

        const code = document.createElement("p");
        code.classList.add("course-code");
        code.textContent = `${course.subject} ${course.number}`;

        const title = document.createElement("h3");
        title.textContent = course.title;

        const meta = document.createElement("div");
        meta.classList.add("course-meta");

        const credits = document.createElement("span");
        credits.textContent =
            `${course.credits} ${course.credits === 1 ? "credit" : "credits"}`;

        const status = document.createElement("span");
        status.classList.add("course-status");
        status.textContent = course.completed
            ? "✓ Completed"
            : "In progress";

        meta.append(credits, status);
        card.append(code, title, meta);
        courseContainer.appendChild(card);
    });

    const totalCredits = courseList.reduce(
        (total, course) => total + course.credits,
        0
    );

    courseCount.textContent =
        `${courseList.length} ${courseList.length === 1 ? "course" : "courses"}`;

    creditTotal.textContent =
        `${totalCredits} ${totalCredits === 1 ? "credit" : "credits"}`;
}

function filterCourses(subject) {
    const filteredCourses = subject === "all"
        ? courses
        : courses.filter((course) => course.subject === subject);

    displayCourses(filteredCourses);
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter;

        filterButtons.forEach((filterButton) => {
            const isActive = filterButton === button;

            filterButton.classList.toggle("active", isActive);
            filterButton.setAttribute("aria-pressed", String(isActive));
        });

        filterCourses(selectedFilter);
    });
});

displayCourses(courses);
