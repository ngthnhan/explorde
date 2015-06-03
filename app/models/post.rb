class Post < ActiveRecord::Base
	has_attached_file :image, styles: { :medium => "512x512#", :thumb => "100x100#" }
  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/
  serialize :pixel_matrices, Array
end
