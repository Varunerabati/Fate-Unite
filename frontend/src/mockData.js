// Mock data for F.A.T.E Landing Page

export const mockFormSubmission = {
  submitFeedback: async (formData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Mock form submission:', {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      timestamp: new Date().toISOString(),
      targetEmail: 'fateunite1807@gmail.com'
    });
    
    // Simulate successful submission
    return {
      success: true,
      message: 'Your message has been sent successfully!'
    };
  }
};

export const socialMediaLinks = {
  instagram: 'https://instagram.com/fate_unite',
  linkedin: '#', // Placeholder until LinkedIn profile is created
  email: 'mailto:fateunite1807@gmail.com'
};

export const foundersData = [
  {
    id: 1,
    name: 'Dinesh Vanga',
    role: 'Embedded Engineer',
    title: 'Founder',
    initials: 'DV',
    description: 'Passionate about embedded systems and robotics, Dinesh brings deep technical expertise in hardware design and automation to F.A.T.E\'s educational programs.',
    expertise: ['Embedded Systems', 'Robotics', 'Hardware Design', 'Automation']
  },
  {
    id: 2,
    name: 'Shashank K',
    role: 'IoT Engineer', 
    title: 'Founder',
    initials: 'SK',
    description: 'With extensive experience in IoT and smart systems, Shashank drives innovation in connected technologies and helps students understand the Internet of Things ecosystem.',
    expertise: ['IoT', 'Smart Systems', 'Connected Technologies', 'Innovation']
  }
];

export const servicesData = [
  {
    id: 1,
    title: 'Robotics Workshops',
    description: 'Hands-on robotics sessions covering design, programming, and automation',
    icon: 'Cpu'
  },
  {
    id: 2,
    title: 'IoT Bootcamps',
    description: 'Intensive programs on Internet of Things and smart device development',
    icon: 'Target'
  },
  {
    id: 3,
    title: 'Innovation Hackathons',
    description: 'Competitive events fostering creative problem-solving and teamwork',
    icon: 'Lightbulb'
  },
  {
    id: 4,
    title: 'Mentorship Programs',
    description: 'One-on-one guidance from industry experts and experienced engineers',
    icon: 'Users'
  }
];

export const statsData = [
  {
    id: 1,
    value: '500+',
    label: 'Students Trained',
    icon: 'Users'
  },
  {
    id: 2,
    value: '50+',
    label: 'Workshops Conducted',
    icon: 'Award'
  }
];