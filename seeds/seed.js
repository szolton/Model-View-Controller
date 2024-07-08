const seedDatabase = async () => {
    const transaction = await sequelize.transaction();
  
    try {
      // Seed users ensuring uniqueness
      for (const userDataItem of userData) {
        const existingUser = await User.findOne({ where: { email: userDataItem.email } });
        if (!existingUser) {
          await User.create(userDataItem, { transaction });
        }
      }
  
      // Seed blog posts with existing user ids
      const users = await User.findAll({ transaction });
      await BlogPost.bulkCreate(
        blogPostData.map((blogPost) => ({
          ...blogPost,
          user_id: users[Math.floor(Math.random() * users.length)].id,
        })),
        { transaction }
      );
  
      // Seed comments with existing user and blogPost ids
      await Comment.bulkCreate(
        commentData.map((comment) => ({
          ...comment,
          user_id: users[Math.floor(Math.random() * users.length)].id,
          blog_post_id: Math.floor(Math.random() * blogPostData.length) + 1,
        })),
        { transaction }
      );
  
      // Commit transaction
      await transaction.commit();
      console.log('Database seeded successfully!');
    } catch (error) {
      // Rollback transaction if any error occurs
      await transaction.rollback();
      console.error('Error seeding database:', error);
    } finally {
      // Close sequelize connection
      await sequelize.close();
    }
  };
  