class User < ActiveRecord::Base
  extend FriendlyId
  friendly_id :username, use: [:slugged]
  validates :slug, presence: true, uniqueness: true
  acts_as_voter

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :lockable
  validates :username, presence: true, uniqueness: { case_sensitive: false }, 
  	format: { with: /\A[a-zA-Z0-9_-]+\Z/ },				# Only accept alphanumeric, -, _. 
  	length: { in: 3..20 }													# Length 3-20
  has_many :posts, dependent: :destroy
	has_many :comments, dependent: :destroy

	self.per_page = 1

	def get_total_likes
		sum = 0
		self.posts.each do |post|
			sum += (post.get_likes.size - post.get_dislikes.size)
		end
		sum
	end

	def get_total_posts
		self.posts.count
	end
end
