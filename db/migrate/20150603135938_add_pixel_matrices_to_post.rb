class AddPixelMatricesToPost < ActiveRecord::Migration
  def self.up
    add_column :posts, :pixel_matrices, :text
  end
  
  def self.down
  	remove_column :posts, :pixel_matrices
	end
end
