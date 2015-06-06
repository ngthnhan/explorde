class Post < ActiveRecord::Base
	acts_as_votable
	belongs_to :user
	has_attached_file :image, styles: { :medium => "512x512#", :thumb => "100x100#" }
  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/
  validates :resolution_level, :title, presence: true
  validates :image, attachment_presence: true
  validates :resolution_level, numericality: { only_integer: true, in: 5..7 }
  serialize :pixel_matrices, Array
end
