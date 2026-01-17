<?php
// public/api/setup/admin/seed_hackathons.php

ob_start();
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../../config/db.php';

echo "<h2>🌱 Seeding Hackathon Data...</h2>";

try {
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Data extracted manually from your hackathons.ts file
    $hackathons = [
        [
            'id' => 'waves-xr-2025',
            'title' => 'XR Creator Hackathon with WAVES 2025',
            'description' => 'National flagship initiative in partnership with Wavelabs and XDG. A 9-month journey culminating at WAVES Summit 2025.',
            'long_description' => "The XR Creator Hackathon with WAVES 2025 is a national flagship initiative designed to discover, nurture, and showcase the next generation of XR creators across India.\n\nThis 9-month journey brings together aspiring developers, designers, and storytellers to build innovative XR experiences that address real-world challenges. From ideation to prototyping to final showcase at Bharat Mandapam, participants will receive mentorship from industry leaders.\n\nWhat you'll build:\n- Immersive AR/VR experiences\n- WebXR applications\n- Mixed reality prototypes\n- XR-powered social impact solutions\n\nThe hackathon is open to students, professionals, and creative technologists who want to push the boundaries of immersive technology in India.",
            'start_date' => '2024-06-01 00:00:00',
            'end_date' => '2025-02-17 23:59:59',
            'registration_deadline' => '2024-07-15 23:59:59',
            'status' => 'live',
            'mode' => 'hybrid',
            'location' => 'Pan-India + Bharat Mandapam, New Delhi',
            'prize_pool' => '₹5,00,000',
            'fee_type' => 'free',
            'fee_amount' => 0.00,
            'team_size_type' => 'team',
            'min_team_size' => 2,
            'max_team_size' => 5,
            'banner_image' => '',
            'meta_tracks' => json_encode(['Gaming', 'Education', 'Healthcare', 'Tourism', 'Social Impact']),
            'meta_mentors' => json_encode([
                ['id' => 'm1', 'name' => 'Priya Sharma', 'role' => 'XR Lead', 'organization' => 'Google India', 'photo' => ''],
                ['id' => 'm2', 'name' => 'Arjun Mehta', 'role' => 'AR Director', 'organization' => 'Snap Inc.', 'photo' => ''],
                ['id' => 'm3', 'name' => 'Kavita Reddy', 'role' => 'VR Architect', 'organization' => 'Meta', 'photo' => ''],
                ['id' => 'm4', 'name' => 'Rahul Gupta', 'role' => 'Creative Technologist', 'organization' => 'Unity', 'photo' => '']
            ]),
            'meta_jury' => json_encode([
                ['id' => 'j1', 'name' => 'Dr. Ananya Singh', 'role' => 'Professor of HCI', 'organization' => 'IIT Delhi', 'photo' => ''],
                ['id' => 'j2', 'name' => 'Vikram Patel', 'role' => 'CEO', 'organization' => 'XR Ventures', 'photo' => ''],
                ['id' => 'j3', 'name' => 'Neha Kapoor', 'role' => 'Innovation Head', 'organization' => 'NASSCOM', 'photo' => '']
            ]),
            'meta_themes' => json_encode([
                ['id' => 't1', 'title' => 'Immersive Education', 'description' => 'Create XR experiences that transform how we learn and teach', 'icon' => '📚'],
                ['id' => 't2', 'title' => 'Cultural Heritage', 'description' => 'Preserve and showcase Indian heritage through immersive technology', 'icon' => '🏛️'],
                ['id' => 't3', 'title' => 'Healthcare Innovation', 'description' => 'Build XR solutions for therapy, training, and patient care', 'icon' => '🏥'],
                ['id' => 't4', 'title' => 'Smart Tourism', 'description' => 'Enhance travel experiences with AR guides and VR previews', 'icon' => '✈️'],
                ['id' => 't5', 'title' => 'Gaming & Entertainment', 'description' => 'Push boundaries of interactive entertainment', 'icon' => '🎮']
            ]),
            'meta_timeline' => json_encode([
                ['id' => 'tl1', 'date' => '2024-06-01', 'title' => 'Registration Opens', 'description' => 'Applications open for all participants across India'],
                ['id' => 'tl2', 'date' => '2024-07-15', 'title' => 'Registration Closes', 'description' => 'Last date to submit your application'],
                ['id' => 'tl3', 'date' => '2024-08-01', 'title' => 'Team Formation', 'description' => 'Find teammates and finalize your squad'],
                ['id' => 'tl4', 'date' => '2024-09-01', 'title' => 'Ideation Phase', 'description' => 'Submit your concept and project proposal'],
                ['id' => 'tl5', 'date' => '2024-10-15', 'title' => 'Mentorship Begins', 'description' => 'Weekly sessions with industry mentors'],
                ['id' => 'tl6', 'date' => '2024-12-01', 'title' => 'Prototype Submission', 'description' => 'Submit your working prototype'],
                ['id' => 'tl7', 'date' => '2025-01-15', 'title' => 'Finals Announcement', 'description' => 'Top 20 teams announced for grand finale'],
                ['id' => 'tl8', 'date' => '2025-02-17', 'title' => 'Grand Finale at WAVES', 'description' => 'Demo Day at Bharat Mandapam, New Delhi']
            ]),
            'meta_prizes' => json_encode([
                ['id' => 'p1', 'position' => 'Winner', 'amount' => '₹2,00,000', 'description' => 'Cash prize + Incubation support + Featured showcase'],
                ['id' => 'p2', 'position' => '1st Runner-up', 'amount' => '₹1,00,000', 'description' => 'Cash prize + Mentorship program access'],
                ['id' => 'p3', 'position' => '2nd Runner-up', 'amount' => '₹50,000', 'description' => 'Cash prize + Hardware credits'],
                ['id' => 'p4', 'position' => 'Best Student Team', 'amount' => '₹25,000', 'description' => 'Special recognition for college teams'],
                ['id' => 'p5', 'position' => 'Best Social Impact', 'amount' => '₹25,000', 'description' => 'For projects addressing social challenges']
            ]),
            'meta_faqs' => json_encode([
                ['id' => 'f1', 'question' => 'Who can participate in this hackathon?', 'answer' => 'The hackathon is open to all Indian citizens above 18 years of age. Students, professionals, and hobbyists are all welcome to participate.'],
                ['id' => 'f2', 'question' => 'Do I need prior XR experience?', 'answer' => 'No prior XR experience is required. We have tracks and mentorship for beginners as well as advanced creators.'],
                ['id' => 'f3', 'question' => 'Can I participate solo?', 'answer' => 'Teams of 2-5 members are required. If you\'re looking for teammates, you can use our team formation platform.'],
                ['id' => 'f4', 'question' => 'What tools can we use?', 'answer' => 'You can use any XR development platform including Unity, Unreal, SnapAR, WebXR, or any other framework of your choice.'],
                ['id' => 'f5', 'question' => 'Is there a registration fee?', 'answer' => 'No, participation is completely free. Selected finalists will also receive travel grants for the finale.'],
                ['id' => 'f6', 'question' => 'Will there be mentorship support?', 'answer' => 'Yes, weekly mentorship sessions with industry experts will be provided throughout the hackathon.']
            ]),
            'meta_partners' => json_encode([
                ['id' => 'pt1', 'name' => 'WAVES', 'type' => 'title'],
                ['id' => 'pt2', 'name' => 'XDG India', 'type' => 'powered'],
                ['id' => 'pt3', 'name' => 'Snap Inc.', 'type' => 'powered'],
                ['id' => 'pt4', 'name' => 'Unity Technologies', 'type' => 'community'],
                ['id' => 'pt5', 'name' => 'Meta', 'type' => 'community']
            ])
        ],
        [
            'id' => 'moodhack-2024',
            'title' => 'MoodHack 2024',
            'description' => 'Create AR experiences that capture and express emotions. Focus on mental health and emotional wellness through immersive tech.',
            'long_description' => "MoodHack 2024 is a unique hackathon focused on the intersection of emotional wellness and augmented reality technology.\n\nParticipants will create AR experiences that help users understand, express, and manage their emotions. From mood-tracking lenses to therapeutic AR environments, this hackathon challenges creators to build technology that nurtures mental health.\n\nThe hackathon is particularly suited for creators interested in:\n- Expressive technology and digital art\n- Mental health applications\n- Therapeutic gaming and interactive experiences\n- Social emotional learning tools",
            'start_date' => '2024-10-01 00:00:00',
            'end_date' => '2024-10-31 23:59:59',
            'registration_deadline' => '2024-09-25 23:59:59',
            'status' => 'completed',
            'mode' => 'online',
            'location' => 'Online',
            'prize_pool' => '₹1,00,000',
            'fee_type' => 'free',
            'fee_amount' => 0.00,
            'team_size_type' => 'team',
            'min_team_size' => 1,
            'max_team_size' => 3,
            'banner_image' => '',
            'meta_tracks' => json_encode(['Wellness', 'Expression', 'Therapy']),
            'meta_mentors' => json_encode([
                ['id' => 'm1', 'name' => 'Dr. Meera Iyer', 'role' => 'Clinical Psychologist', 'organization' => 'NIMHANS', 'photo' => ''],
                ['id' => 'm2', 'name' => 'Rohan Desai', 'role' => 'AR Artist', 'organization' => 'Independent', 'photo' => '']
            ]),
            'meta_jury' => json_encode([
                ['id' => 'j1', 'name' => 'Sanjay Nair', 'role' => 'Mental Health Advocate', 'organization' => 'Mind Matters', 'photo' => ''],
                ['id' => 'j2', 'name' => 'Tanya Malhotra', 'role' => 'Creative Director', 'organization' => 'SnapAR', 'photo' => '']
            ]),
            'meta_themes' => json_encode([
                ['id' => 't1', 'title' => 'Mood Expression', 'description' => 'AR filters and experiences that help express emotions', 'icon' => '🎭'],
                ['id' => 't2', 'title' => 'Therapeutic Spaces', 'description' => 'Calming and healing AR environments', 'icon' => '🧘'],
                ['id' => 't3', 'title' => 'Social Connection', 'description' => 'AR experiences that foster emotional connection', 'icon' => '💬']
            ]),
            'meta_timeline' => json_encode([
                ['id' => 'tl1', 'date' => '2024-10-01', 'title' => 'Hackathon Begins', 'description' => 'Kickoff and theme reveal'],
                ['id' => 'tl2', 'date' => '2024-10-15', 'title' => 'Mid-point Check-in', 'description' => 'Progress review and mentor feedback'],
                ['id' => 'tl3', 'date' => '2024-10-28', 'title' => 'Submission Deadline', 'description' => 'Final project submission'],
                ['id' => 'tl4', 'date' => '2024-10-31', 'title' => 'Winners Announced', 'description' => 'Results and showcase']
            ]),
            'meta_prizes' => json_encode([
                ['id' => 'p1', 'position' => 'Winner', 'amount' => '₹50,000', 'description' => 'Cash prize + Featured on Bharat XR showcase'],
                ['id' => 'p2', 'position' => '1st Runner-up', 'amount' => '₹30,000', 'description' => 'Cash prize + Mentorship session'],
                ['id' => 'p3', 'position' => '2nd Runner-up', 'amount' => '₹20,000', 'description' => 'Cash prize']
            ]),
            'meta_faqs' => json_encode([
                ['id' => 'f1', 'question' => 'What platforms are supported?', 'answer' => 'We recommend SnapAR/Lens Studio, but any AR development platform is acceptable.'],
                ['id' => 'f2', 'question' => 'Is this suitable for beginners?', 'answer' => 'Yes! We have resources and mentor support for those new to AR development.']
            ]),
            'meta_partners' => json_encode([
                ['id' => 'pt1', 'name' => 'SnapAR', 'type' => 'title'],
                ['id' => 'pt2', 'name' => 'Mental Health Foundation', 'type' => 'community']
            ])
        ],
        [
            'id' => 'novhack-2024',
            'title' => 'NovHack 2024',
            'description' => 'November hackathon focused on festive AR experiences. Create effects for Diwali, holidays, and celebrations.',
            'long_description' => "NovHack 2024 is a festive-themed AR hackathon celebrating the spirit of Diwali and the holiday season.\n\nCreate AR experiences that capture the joy, color, and cultural richness of Indian festivals. From virtual diyas to AR rangoli creators, participants will build experiences that bring celebrations to life in augmented reality.\n\nPerfect for creators who want to:\n- Celebrate cultural heritage through technology\n- Create shareable festive content\n- Explore AR face filters and world effects\n- Build community-focused experiences",
            'start_date' => '2024-11-01 00:00:00',
            'end_date' => '2024-11-15 23:59:59',
            'registration_deadline' => '2024-10-28 23:59:59',
            'status' => 'completed',
            'mode' => 'online',
            'location' => 'Online',
            'prize_pool' => '₹75,000',
            'fee_type' => 'free',
            'fee_amount' => 0.00,
            'team_size_type' => 'solo',
            'min_team_size' => 1,
            'max_team_size' => 1,
            'banner_image' => '',
            'meta_tracks' => json_encode(['Festivals', 'Celebrations', 'Cultural']),
            'meta_mentors' => json_encode([
                ['id' => 'm1', 'name' => 'Ankit Jain', 'role' => 'Lens Creator', 'organization' => 'Snap Stars', 'photo' => '']
            ]),
            'meta_jury' => json_encode([
                ['id' => 'j1', 'name' => 'Prachi Sharma', 'role' => 'Community Lead', 'organization' => 'Bharat XR', 'photo' => '']
            ]),
            'meta_themes' => json_encode([
                ['id' => 't1', 'title' => 'Diwali Magic', 'description' => 'AR experiences celebrating the festival of lights', 'icon' => '🪔'],
                ['id' => 't2', 'title' => 'Family Celebrations', 'description' => 'AR that brings families together', 'icon' => '👨‍👩‍👧‍👦'],
                ['id' => 't3', 'title' => 'Cultural Art', 'description' => 'Digital rangoli, mehndi, and traditional art in AR', 'icon' => '🎨']
            ]),
            'meta_timeline' => json_encode([
                ['id' => 'tl1', 'date' => '2024-11-01', 'title' => 'Hackathon Begins', 'description' => 'Start building your festive AR experience'],
                ['id' => 'tl2', 'date' => '2024-11-12', 'title' => 'Submission Deadline', 'description' => 'Final submissions due'],
                ['id' => 'tl3', 'date' => '2024-11-15', 'title' => 'Results', 'description' => 'Winners announced during Diwali week']
            ]),
            'meta_prizes' => json_encode([
                ['id' => 'p1', 'position' => 'Winner', 'amount' => '₹35,000', 'description' => 'Cash prize + Featured spotlight'],
                ['id' => 'p2', 'position' => '1st Runner-up', 'amount' => '₹25,000', 'description' => 'Cash prize'],
                ['id' => 'p3', 'position' => '2nd Runner-up', 'amount' => '₹15,000', 'description' => 'Cash prize']
            ]),
            'meta_faqs' => json_encode([
                ['id' => 'f1', 'question' => 'Can I participate solo?', 'answer' => 'Yes! This hackathon is designed for individual creators.'],
                ['id' => 'f2', 'question' => 'What should I build?', 'answer' => 'Create AR lenses, filters, or experiences that celebrate festivals and cultural traditions.']
            ]),
            'meta_partners' => json_encode([
                ['id' => 'pt1', 'name' => 'SnapAR', 'type' => 'title']
            ])
        ]
    ];

    $sql = "INSERT INTO hackathons (
        id, title, description, long_description,
        start_date, end_date, registration_deadline,
        status, mode, location, prize_pool,
        fee_type, fee_amount, team_size_type,
        min_team_size, max_team_size, banner_image,
        meta_tracks, meta_mentors, meta_jury, meta_themes,
        meta_timeline, meta_prizes, meta_faqs, meta_partners
    ) VALUES (
        :id, :title, :description, :long_description,
        :start_date, :end_date, :registration_deadline,
        :status, :mode, :location, :prize_pool,
        :fee_type, :fee_amount, :team_size_type,
        :min_team_size, :max_team_size, :banner_image,
        :meta_tracks, :meta_mentors, :meta_jury, :meta_themes,
        :meta_timeline, :meta_prizes, :meta_faqs, :meta_partners
    ) ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description)";

    $stmt = $conn->prepare($sql);

    foreach ($hackathons as $h) {
        $stmt->execute($h);
        echo "✅ Inserted/Updated: <b>{$h['title']}</b><br>";
    }

    echo "<hr><h3>🎉 Success! 3 Hackathons Added.</h3>";

} catch(PDOException $e) {
    echo "<h3 style='color:red'>❌ Error:</h3> " . $e->getMessage();
}
?>