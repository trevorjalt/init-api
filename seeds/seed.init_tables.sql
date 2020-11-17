BEGIN;

TRUNCATE
    user_information,
    init_posts,
    following
    RESTART IDENTITY CASCADE;

INSERT INTO user_information (fullname, username, user_password, email, profile_photo, about_user, user_stack)
VALUES
    ('Kakarot', 'Really Son Goku', '$2a$12$3yf.8jQ4tnfQPzARFkkjP.h12CHtJjz1xFJgPo3kTtWcZCswjPu3a', 'goku@gmail.com', '/hexadeci', 'I love to eat, fight, and that is about it!', 'Frontend'),
    ('Vegeta', 'The Strongest Ever', '$2a$12$yLwyuRRlkhaATZ8PtuhX7eiWvJmmkWyvy74.yvBzJGLSZiGumrrDa', 'vegeta@gmail.com', '/hexadeci', 'I am the Prince of all Saiyans. What else do you need to know...', 'Full Stack'),
    ('Gohan', 'ProfessorGo', '$2a$12$6jexarPNvKvKFx/stNvYF.l3bRfkLJiptPF5G5vbYg7gBhDWSKH.2', 'gohan@yahoo.com', '/hexadeci', 'Proud nerd and father.', 'Backend'),
    ('Trunks', 'Time Traveller Trunks', '$2a$12$zh9chAG0bjcvniAQQuQ0quZ/7qD1ihon2Kk5Bz6N.YeVdCI1ES9Nu', 'trunks@yahoo.com', '/hexadeci', 'Although Androids weird me out, I still need to make a living.', 'Frontend');

INSERT INTO init_posts (username, post_title, post_description, post_live_link, post_repository, post_image, tech_stack, user_id)
VALUES
    ('Really Son Goku', 'My Computer', 'Here is the sweet machine I use', 'https://gs-computer.vercel.app/', 'https://github.com/reallysongoku/compuuuter', '/hexadeci', 'Sony A6000', 1),
    ('The Strongest Ever', 'Zenkai Power', 'Doctor Brief needed an algorithm to understand the Saiyan healing process', 'https://zenkai.vercel.app/', 'https://github.com/thestrongestever/zenkai', '/hexadeci', 'Python', 2),
    ('The Strongest Ever', 'Key to Strength', 'Source code for the artifical gravity machine', 'https://artificial-gravity.vercel.app/', 'https://github.com/thestrongestever/AG', '/hexadeci', 'Python', 2),
    ('ProfessorGo', 'Biology of Cell', 'The secrets to understanding the genetic makeup of Cell', 'https://how-cell-works.vercel.app/', 'https://github.com/professorgo/cell', '/hexadeci', 'React, Node', 3),
    ('ProfessorGo', 'Great Book List', 'A list of all of my favorite books put together into a nice website', 'https://greatest-books.vercel.app/', 'https://github.com/professorgo/greatbooks', '/hexadeci', 'Javascript, CSS', 3),
    ('ProfessorGo', 'Herculean Suit', 'Code for a powered exoskeleton for my father in law, Hercule', 'https://herculean-suit.vercel.app/', 'https://github.com/professorgo/herculean', '/hexadeci', 'C#', 3),
    ('Time Traveller Trunks', 'Buster Katana', 'Blueprint for 3D printing my old katana','https://buster-katana.vercel.app/', 'https://github.com/timetravellertrunks/katana', '/hexadeci', 'Python', 4),
    ('Time Traveller Trunks', 'Pro Port', 'Not really a big deal... just my killer portfolio', 'https://ttt-portfolio.vercel.app/', 'https://github.com/timetravellertrunks/portfolio', '/hexadeci', 'HTML, Javascript, CSS', 4);

INSERT INTO following (following_id, user_id)
VALUES
    (1, 1),
    (2, 1),
    (3, 1),
    (4, 1),
    (1, 2),
    (2, 2),
    (4, 2),
    (1, 3),
    (2, 3),
    (3, 3),
    (4, 3),
    (2, 4),
    (3, 4),
    (4, 4);

COMMIT;